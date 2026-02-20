import type { Request } from 'express';
import type { JwtUserData } from './jwt';
//declare 描述那些不是由 TypeScript 编写、但在运行时确实存在的代码的方式。
// declare的四种语法
// 1. 描述全局变量 declare (var|let|const) 变量名: 类型;
// 2. 描述全局函数 declare function 函数名(参数: 类型): 返回类型;
// 3. 描述全局类 declare class 类名 { 属性: 类型; 方法(): 类型; }
// 4. 描述全局接口 declare module '模块名' { ...内容... }
declare module 'express' {
  interface Request {
    user: JwtUserData;
  }
}
