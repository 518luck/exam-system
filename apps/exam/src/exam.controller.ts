import { Controller, Get } from '@nestjs/common';
import { ExamService } from './exam.service';
import { MessagePattern } from '@nestjs/microservices';
import { RedisService } from '@app/redis';

@Controller()
export class ExamController {
  constructor(
    private readonly examService: ExamService,
    private readonly redisService: RedisService,
  ) {}

  @Get()
  async getHello(): Promise<string> {
    const keys = await this.redisService.keys('*');
    return this.examService.getHello() + keys.join(',');
  }

  @MessagePattern('sum')
  sum(numArr: Array<number>): number {
    return numArr.reduce((total, item) => total + item, 0);
  }
}
