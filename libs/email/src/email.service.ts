import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: Transporter;

  //构造函数里的代码在类实例化时（也就是 NestJS 启动时）只执行一次。
  //并不是简单的变量赋值，它实际上是在初始化一个 SMTP 连接池（Connection Pool）。
  constructor() {
    this.transporter = createTransport({
      host: 'smtp.qq.com',
      port: 587,
      secure: false,
      auth: {
        user: '1512013298@qq.com',
        pass: 'hiiyxcqjukksjiab',
      },
    });
  }

  async sendMail({
    to,
    subject,
    html,
  }: {
    to: string;
    subject: string;
    html: string;
  }) {
    await this.transporter.sendMail({
      from: {
        name: '考试系统',
        address: '1512013298@qq.com',
      },
      to,
      subject,
      html,
    });
  }
}
