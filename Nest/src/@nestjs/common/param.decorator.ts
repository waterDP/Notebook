/*
 * @Author: water.li
 * @Date: 2024-07-07 21:02:19
 * @Description:
 * @FilePath: \Notebook\Nest\src\@nestjs\common\param.decorator.ts
 */
import "reflect-metadata";
import { DECORATOR_FACTORY } from '../core/constants';

export const createParamDecorator = (keyOrFactory: string | Function) => {
  return (data?: any, ...pipes: any[]) =>
    (target: any, propertyKey: string, parameterIndex: number) => {
      // 给控制器类的原型的propertyKey也就是handleRequest方法属性上添加元数据
      // ^ 属性名是params:handleRequest 值是一个数组，数组里的值表示，哪个位置使用哪个头饰器
      const existingParameters =
        Reflect.getMetadata("params", target, propertyKey) || [];

      if (keyOrFactory instanceof Function) {
        existingParameters[parameterIndex] = {
          parameterIndex,
          key: DECORATOR_FACTORY,
          factory: keyOrFactory,
          data,
          pipes,
        };
      } else {
        existingParameters[parameterIndex] = {
          parameterIndex,
          key: keyOrFactory,
          data,
          pipes,
        };
      }
      Reflect.defineMetadata(`params`, existingParameters, target, propertyKey);
    };
};

export const Request = createParamDecorator("Request");
export const Req = createParamDecorator("Req");
export const Query = createParamDecorator("Query");
export const Headers = createParamDecorator("Headers");
export const Session = createParamDecorator("Session");
export const Ip = createParamDecorator("Ip");
export const Param = createParamDecorator("Param");
export const Body = createParamDecorator("Body");
export const Response = createParamDecorator("Response");
export const Res = createParamDecorator("Res");
export const Next = createParamDecorator("Next");
