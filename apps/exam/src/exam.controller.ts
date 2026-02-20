import { Body, Controller, Post } from '@nestjs/common';
import { ExamService } from './exam.service';
import { MessagePattern } from '@nestjs/microservices';
import { RedisService } from '@app/redis';
import { RequireLogin, UserInfo } from '@app/common';
import { ExamAddDto } from './dto/exam-add.dto';

@Controller()
export class ExamController {
  constructor(
    private readonly examService: ExamService,
    private readonly redisService: RedisService,
  ) {}

  // 测试微服务
  @MessagePattern('sum')
  sum(numArr: Array<number>): number {
    return numArr.reduce((total, item) => total + item, 0);
  }

  // 添加考试
  @Post('add')
  @RequireLogin()
  add(@Body() dto: ExamAddDto, @UserInfo('userId') userId: number) {
    return this.examService.add(dto, userId);
  }
}
