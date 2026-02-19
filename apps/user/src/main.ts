import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(UserModule);

  app.useGlobalPipes(
    new ValidationPipe({
      //白名单模式 自动过滤掉 DTO（数据传输对象）中未定义的属性
      whitelist: true,
      //禁止非白名单 它比 whitelist 更严格。一旦发现前端传了 DTO 之外的字段，直接抛出异常（400 Bad Request）。
      forbidNonWhitelisted: true,
      //自动类型转换 将前端传来的普通 JavaScript 对象自动转换为你定义的 DTO 类的实例，并尝试自动转换类型。
      transform: true,
    }),
  );

  await app.listen(3001);
}
void bootstrap();
