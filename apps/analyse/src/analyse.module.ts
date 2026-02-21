import { Module } from '@nestjs/common';
import { AnalyseController } from './analyse.controller';
import { AnalyseService } from './analyse.service';
import { RedisModule } from '@app/redis';
import { PrismaModule } from '@app/prisma';
import { AuthGuard, CommonModule } from '@app/common';
import { APP_GUARD } from '@nestjs/core';
// imports 和 providers 的分工不同
// imports: [CommonModule]：这相当于在你的模块里打开了工具箱。如果 CommonModule 导出了 AuthGuard，你现在可以在当前模块的任何地方引用这个类。
// providers: [...]：这是在配置当前的依赖注入容器。
// 当你写 { provide: APP_GUARD, useClass: AuthGuard } 时，你不是在引用它，而是在告诉 NestJS 引擎：“请在这个模块（以及它的作用域）内，启用这个全局守卫。”
@Module({
  imports: [RedisModule, PrismaModule, CommonModule],
  controllers: [AnalyseController],
  providers: [
    AnalyseService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AnalyseModule {}
