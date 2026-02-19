import { PrismaService } from '@app/prisma';
import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '../../../src/generated/prisma/client';

@Injectable()
export class UserService {
  @Inject(PrismaService)
  private prisma: PrismaService;

  async create(data: Prisma.UserCreateInput) {
    const result = await this.prisma.user.create({
      data,
      select: {
        id: true,
      },
    });
    return result;
  }
}
