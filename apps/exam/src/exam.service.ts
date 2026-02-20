import { PrismaService } from '@app/prisma';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ExamAddDto } from './dto/exam-add.dto';
import { ExamSaveDto } from './dto/exam-save.dto';

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

  // 获取考试列表
  async list(userId: number, bin: string) {
    //.findMany 查找多个 作用：对应 SQL 中的 SELECT *。它会返回一个数组。
    return this.prismaService.exam.findMany({
      where:
        bin !== undefined
          ? {
              createUserId: userId,
              isDelete: true,
            }
          : {
              createUserId: userId,
            },
    });
  }

  // 删除考试  带权限控制的逻辑删除
  // 它并不是真的删除了数据库里的一行，而是通过更新状态位来标记它“已删除”。
  async delete(userId: number, id: number) {
    //update 执行更新操作
    return this.prismaService.exam.update({
      where: {
        //查找“主键 ID 为 id 且 创建者 ID 是 userId”的记录。
        //（越权保护）：如果用户 A 试图调用接口删除用户 B 的考试（修改 URL 里的 ID），因为 createUserId 对不上，Prisma 会找不到这条记录并抛出错误。这在后端开发中叫防止“平行越权”。
        id,
        createUserId: userId,
      },
      //将 isDelete 字段的值改为 true。
      data: {
        isDelete: true,
      },
    });
  }

  // 保存考试
  async save(dto: ExamSaveDto) {
    const isExist = await this.prismaService.exam.findFirst({
      where: {
        id: dto.id,
      },
    });
    if (!isExist) {
      throw new NotFoundException('考试不存在');
    }
    return this.prismaService.exam.update({
      where: {
        id: dto.id,
      },
      data: {
        content: dto.content,
      },
    });
  }

  // 发布考试
  async publish(userId: number, id: number) {
    return this.prismaService.exam.update({
      where: {
        id,
        createUserId: userId,
      },
      data: {
        isPublish: true,
      },
    });
  }

  // 取消发布考试
  async unpublish(userId: number, id: number) {
    return this.prismaService.exam.update({
      where: {
        id,
        createUserId: userId,
      },
      data: {
        isPublish: false,
      },
    });
  }
}
