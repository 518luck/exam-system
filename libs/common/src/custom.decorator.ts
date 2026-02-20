import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { Request } from 'express';
import type { JwtUserData } from './types/jwt';
import type { AuthRequest } from './types/common';
export const RequireLogin = () => SetMetadata('require-login', true);

// createParamDecorator 这是 NestJS 提供的工具函数，专门用来创建参数装饰器。它接收一个工厂函数，这个函数有两个参数：
// data：装饰器的参数，这里是字符串类型，用来指定用户信息中的属性名。
// ctx：执行上下文，用来获取当前请求的信息。
export const UserInfo = createParamDecorator(
  // keyof 它的作用是：把一个对象（接口或类）的所有“属性名”提取出来，组成一个新的联合类型（Union Type）。
  (data: keyof JwtUserData, ctx: ExecutionContext) => {
    //NestJS 默认支持多种协议（HTTP, WebSockets, 微服务），通过 switchToHttp()，我们明确告诉框架：“我现在在处理一个 HTTP 请求，请把底层的 Request 对象给我。
    const request = ctx.switchToHttp().getRequest<AuthRequest>();

    if (!request.user) {
      return null;
    }
    return data ? request.user[data] : request.user;
  },
);
