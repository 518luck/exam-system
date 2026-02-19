import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { RedisService } from '@app/redis';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly redisService: RedisService,
  ) {}

  // 注册
  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    delete registerUser?.captcha;
    return await this.userService.create(registerUser);
  }
}
