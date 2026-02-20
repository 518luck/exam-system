import { PrismaService } from '@app/prisma';
import { Inject, Injectable } from '@nestjs/common';
import { ExamAddDto } from './dto/exam-add.dto';

@Injectable()
export class ExamService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  // 添加考试
  async add(dto: ExamAddDto, userId: number) {
    const exam = await this.prismaService.exam.create({
      data: {
        name: dto.name,
        content: '',
        //createUser：这是你在 Schema 里定义的虚拟关联字段名。
        createUser: {
          //connect：这是 Prisma 的原子操作指令。它告诉数据库：“不要创建新用户，而是连接到一个已经存在的、主键 ID 为 userId 的用户”。
          connect: {
            id: userId,
          },
        },
      },
    });
    return exam;
  }
}
