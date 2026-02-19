import { PrismaService } from '@app/prisma';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  @Inject(PrismaService)
  private prisma: PrismaService;

  getHello(): string {
    return 'Hello World!';
  }
}
