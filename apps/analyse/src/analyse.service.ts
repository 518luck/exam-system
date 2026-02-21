import { PrismaService } from '@app/prisma';
import { RedisService } from '@app/redis';
import { Inject, Injectable } from '@nestjs/common';
import { Answer } from 'src/generated/prisma/client';

@Injectable()
export class AnalyseService {
  @Inject(PrismaService)
  prismaService: PrismaService;

  @Inject(RedisService)
  redisService: RedisService;

  // 获取考试排名
  async ranking(examId: number) {
    const answers = await this.prismaService.answer.findMany({
      where: {
        examId,
      },
    });

    for (let i = 0; i < answers.length; i++) {
      // 每个答案的分数都添加到有序集合中
      await this.redisService.zAdd('ranking:' + examId, {
        [answers[i].id]: answers[i].score,
      });
    }
    const ids = await this.redisService.zRankingList(
      'ranking:' + examId,
      0,
      10,
    );

    const res: Answer[] = [];
    for (let i = 0; i < ids.length; i++) {
      const answer = await this.prismaService.answer.findUnique({
        where: {
          id: +ids[i],
        },
        include: {
          answerer: true,
          exam: true,
        },
      });
      if (answer) {
        res.push(answer);
      }
    }
    return res;
  }
}
