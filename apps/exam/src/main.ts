import { NestFactory } from '@nestjs/core';
import { ExamModule } from './exam.module';
import { Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(ExamModule);

  // 配置微服务
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      port: 8888,
    },
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // 启动微服务
  await app.startAllMicroservices();

  app.enableCors();

  await app.listen(3002);
}
void bootstrap();
