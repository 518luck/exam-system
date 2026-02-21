import { PrismaService } from '@app/prisma';
import { Inject, Injectable } from '@nestjs/common';
import { AnswerAddDto } from './dto/answer-add.dto';
// 定义单个题目的结构
interface ExamQuestion {
  id: number; // 题目唯一 ID (时间戳)
  question: string; // 题干内容
  type: 'radio' | 'checkbox' | 'input'; // 题目类型，建议用字面量联合类型更安全
  options: string[]; // 选项列表
  score: number; // 分数
  answer: string; // 正确答案
  answerAnalyse: string; // 答案解析
}

// 定义学生提交的答卷结构
interface ExamAnswer {
  id: number; // 题目唯一 ID (时间戳)
  answer: string; // 学生答案
}

@Injectable()
export class AnswerService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  // 添加答卷
  async add(dto: AnswerAddDto, userId: number) {
    // 获取考卷答案
    const exam = await this.prismaService.exam.findUnique({
      where: {
        id: dto.examId,
      },
    });
    let questions: ExamQuestion[] = [];
    try {
      questions = JSON.parse(exam?.content || '[]') as ExamQuestion[];
    } catch {
      throw new Error('考试内容格式错误');
    }
    let answers: ExamAnswer[] = [];
    try {
      answers = JSON.parse(dto.content) as ExamAnswer[];
    } catch {
      throw new Error('答卷内容格式错误');
    }
    let totalScore = 0;

    answers.forEach((answer) => {
      const question = questions.find((item) => item.id === answer.id);

      if (!question) {
        throw new Error(`题目 ${answer.id} 不存在`);
      }
      if (question.type === 'input') {
        //.includes()：JavaScript 的内置方法，用于判断一个数组或字符串是否包含某个子内容。
        if (answer.answer.includes(question.answer)) {
          totalScore += question.score;
        }
      } else {
        if (answer.answer === question.answer) {
          totalScore += question.score;
        }
      }
    });

    const answer = await this.prismaService.answer.create({
      data: {
        content: dto.content,
        score: totalScore,
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
