import { PrismaService } from '@app/prisma';
import { Inject, Injectable } from '@nestjs/common';
import { AnswerAddDto } from './dto/answer-add.dto';

@Injectable()
export class AnswerService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  // 添加答卷
  async add(dto: AnswerAddDto, userId: number) {
    const answer = await this.prismaService.answer.create({
      data: {
        content: dto.content,
        score: 0,
        answerer: {
          connect: {
            id: userId,
          },
        },
        exam: {
          connect: {
            id: dto.examId,
          },
        },
      },
    });

    return answer;
  }

  // 获取答卷列表
  async list(examId: number) {
    // findMany：查询多个
    return this.prismaService.answer.findMany({
      where: {
        examId,
      },
      //include：关联加载 (Eager Loading)
      include: {
        exam: true,
        answerer: true,
      },
    });
  }

  // 获取答卷详情
  async find(id: number) {
    return this.prismaService.answer.findUnique({
      where: {
        id,
      },
      include: {
        exam: true,
        answerer: true,
      },
    });
  }
}
