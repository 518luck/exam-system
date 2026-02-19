import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Request, Response } from 'express';
import type { JwtUserData } from './types/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  @Inject()
  private reflector: Reflector;

  @Inject(JwtService)
  private jwtService: JwtService;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();

    /** * 从当前 Handler（方法）和 Class（控制器）中提取 'require-login' 元数据。
     * getAllAndOverride 的作用是：如果方法和类都有该标签，优先取方法上的设置。
     */
    const requireLogin = this.reflector.getAllAndOverride<boolean>(
      'require-login',
      [context.getClass(), context.getHandler()],
    );
    if (!requireLogin) {
      return true;
    }

    const authorization = request.headers.authorization;
    if (!authorization) {
      //401 Unauthorized
      throw new UnauthorizedException('用户未登录');
    }

    try {
      const token = authorization.split(' ')[1];
      const data = this.jwtService.verify<JwtUserData>(token);

      request.user = {
        userId: data.userId,
        username: data.username,
      };

      // token验证成功之后,自动在response header中返回新的token
      response.header(
        'token',
        this.jwtService.sign(
          {
            userId: data.userId,
            username: data.username,
          },
          {
            expiresIn: '7d',
          },
        ),
      );
      return true;
    } catch {
      //401 Unauthorized
      throw new UnauthorizedException('token 失效，请重新登录');
    }
  }
}
