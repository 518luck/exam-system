import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { AnswerService } from './answer.service';
import { ClientProxy } from '@nestjs/microservices';
import { RequireLogin, UserInfo } from '@app/common';
import { AnswerAddDto } from './dto/answer-add.dto';

@Controller('answer')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Inject('EXAM_SERVICE')
  private examClient: ClientProxy;

  // 添加答卷
  @Post('add')
  @RequireLogin()
  add(@Body() addDto: AnswerAddDto, @UserInfo('userId') userId: number) {
    return this.answerService.add(addDto, userId);
  }

  // 获取答卷列表
  @Get('list')
  @RequireLogin()
  list(@Query('examId') examId: string) {
    if (!examId) {
      //HTTP 400
      throw new BadRequestException('examId 不能为空');
    }
    return this.answerService.list(+examId);
  }

  // 获取答卷详情
  @Get('find/:id')
  @RequireLogin()
  find(@Param('id') id: string) {
    return this.answerService.find(+id);
  }

  // 导出答卷excel
  @Get('export')
  export(@Query('examId') examId: string) {
    if (!examId) {
      throw new BadRequestException('examId 不能为空');
    }
    // return this.answerService.export(+examId);
  }
}
