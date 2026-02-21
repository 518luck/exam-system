import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ExamService } from './exam.service';
import { MessagePattern } from '@nestjs/microservices';
import { RedisService } from '@app/redis';
import { RequireLogin, UserInfo } from '@app/common';
import { ExamAddDto } from './dto/exam-add.dto';
import { ExamSaveDto } from './dto/exam-save.dto';

@Controller('exam')
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

  // 获取考试列表
  @Get('list')
  @RequireLogin()
  list(@UserInfo('userId') userId: number, @Query('bin') bin: string) {
    return this.examService.list(userId, bin);
  }

  // 删除考试
  @Delete('delete/:id')
  @RequireLogin()
  del(@UserInfo('userId') userId: number, @Param('id') id: string) {
    return this.examService.delete(userId, +id);
  }

  // 保存考试
  @Post('save')
  @RequireLogin()
  save(@Body() dto: ExamSaveDto) {
    return this.examService.save(dto);
  }

  // 发布考试
  @Get('publish/:id')
  @RequireLogin()
  publish(@UserInfo('userId') userId: number, @Param('id') id: string) {
    return this.examService.publish(userId, +id);
  }

  // 取消发布考试
  @Get('unpublish/:id')
  @RequireLogin()
  unpublish(@UserInfo('userId') userId: number, @Param('id') id: string) {
    return this.examService.unpublish(userId, +id);
  }

  // 回显试卷
  @Get('find/:id')
  @RequireLogin()
  find(@Param('id') id: string, @UserInfo('userId') userId: number) {
    return this.examService.find(+id, userId);
  }
}
