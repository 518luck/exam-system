import { PrismaService } from '@app/prisma';
import { Inject, Injectable } from '@nestjs/common';
import { AnswerAddDto } from './dto/answer-add.dto';

@Injectable()
export class AnswerService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

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
}
