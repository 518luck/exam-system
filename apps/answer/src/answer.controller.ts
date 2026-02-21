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
import { ExcelService } from '@app/excel';

@Controller('answer')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Inject('EXAM_SERVICE')
  private examClient: ClientProxy;

  @Inject(ExcelService)
  private excelService: ExcelService;

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
  async export(@Query('examId') examId: string) {
    if (!examId) {
      throw new BadRequestException('examId 不能为空');
    }
    const data = await this.answerService.list(+examId);
    const columns = [
      { header: 'ID', key: 'id', width: 20 },
      { header: '分数', key: 'score', width: 30 },
      { header: '答题人', key: 'answerer', width: 30 },
      { header: '试卷', key: 'exam', width: 30 },
      { header: '创建时间', key: 'createTime', width: 30 },
    ];
    const res = data.map((item) => {
      return {
        id: item.id,
        score: item.score,
        answerer: item.answerer.username,
        exam: item.exam.name,
        createTime: item.createTime,
      };
    });
    return this.excelService.export(columns, res, 'answers.xlsx');
  }
}
