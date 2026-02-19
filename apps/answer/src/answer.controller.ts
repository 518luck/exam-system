import { Controller, Get, Inject } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller()
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Inject('EXAM_SERVICE')
  private examClient: ClientProxy;

  @Get()
  async getHello() {
    //send():请求/响应模式。你会等待微服务算完并给你回传结果。
    //emit():事件驱动模式。只负责发送，不关心结果，也不等回复。
    const value = await firstValueFrom<number>(
      this.examClient.send('sum', [1, 3, 5]),
    );
    return this.answerService.getHello() + ' ' + value;
  }
}
