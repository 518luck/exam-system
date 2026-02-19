import { PrismaService } from '@app/prisma';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { RedisService } from '@app/redis';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class UserService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  @Inject(RedisService)
  private redisService: RedisService;

  private logger = new Logger();

  // 注册
  async register(user: RegisterUserDto) {
    const captcha = await this.redisService.get(`captcha_${user.email}`);

    if (!captcha) {
      // HttpException 400的报错
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }

    if (user.captcha !== captcha) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }

    //this.prismaService.user : 指向数据库中的 User 表
    //findUnique : 这是 Prisma 的“精准查找”指令。它要求查询条件必须是数据库中定义为 UNIQUE（唯一）或 PRIMARY KEY（主键）的字段。
    const foundUser = await this.prismaService.user.findUnique({
      where: {
        username: user.username,
      },
    });

    if (foundUser) {
      throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.prismaService.user.create({
        data: {
          username: user.username,
          password: user.password,
          email: user.email,
        },
        select: {
          id: true,
          username: true,
          email: true,
          createTime: true,
        },
      });
    } catch (e) {
      //第二个参数 UserService：这是日志的 上下文（Context）。它会在打印时带上 [UserService] 标签
      this.logger.error(e, UserService);
      return null;
    }
  }
}
