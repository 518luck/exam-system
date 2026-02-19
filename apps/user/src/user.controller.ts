import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { RedisService } from '@app/redis';
import { RegisterUserDto } from './dto/register-user.dto';
import { EmailService } from '@app/email';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('user')
export class UserController {
  constructor(
    private readonly emailService: EmailService,
    private readonly userService: UserService,
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
  ) {}

  // 获取注册验证码
  @Get('register-captcha')
  async captcha(@Query('address') address: string) {
    const code = Math.random().toString().slice(2, 8);

    await this.redisService.set(`captcha_${address}`, code, 50 * 60);

    await this.emailService.sendMail({
      to: address,
      subject: '注册验证码',
      html: `<p>你的注册验证码是 ${code}</p>`,
    });
    return '发送成功';
  }

  // 注册
  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    return await this.userService.register(registerUser);
  }

  // 登录
  @Post('login')
  async userLogin(@Body() loginUser: LoginUserDto) {
    const foundUser = await this.userService.login(loginUser);
    const newFoundUser = {
      ...foundUser,
      password: undefined,
    };
    // 登录成功后，生成 JWT  token
    const token = this.jwtService.sign(
      {
        userId: newFoundUser.id,
        username: newFoundUser.username,
      },
      {
        expiresIn: '7d',
      },
    );
    return {
      newFoundUser,
      token,
    };
  }
}
