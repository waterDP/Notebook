/*
 * @Author: water.li
 * @Date: 2024-06-27 21:38:05
 * @Description:
 * @FilePath: \Notebook\Nest\src\@nestjs\common\http-methods.decorator.ts
 */
import "reflect-metadata";

export function Get(path: string = ""): MethodDecorator {
  /**
   * @param target AppController.prototype 类的原型
   * @param propertyKey 方法名index
   * @param descriptor index方法的属性描述器
   */
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata("path", path, descriptor.value);
    Reflect.defineMetadata("method", "GET", descriptor.value);
  };
}

export function Post(path: string = ""): MethodDecorator {
  /**
   * @param target AppController.prototype 类的原型
   * @param propertyKey 方法名index
   * @param descriptor index方法的属性描述器
   */
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata("path", path, descriptor.value);
    Reflect.defineMetadata("method", "GET", descriptor.value);
  };
}

export function Redirect(
  url: string = "",
  statusCode: number = 302
): MethodDecorator {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata("redirectUrl", url, descriptor.value);
    Reflect.defineMetadata("redirectStatusCode", statusCode, descriptor.value);
  };
}

export function HttpCode(statusCode: number = 200): MethodDecorator {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata("statusCode", statusCode, descriptor.value);
  };
}

export function Header(name: string, value: string): MethodDecorator {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const existingHeaders = Reflect.getMetadata('headers', descriptor, value) ?? [];
    existingHeaders.push(name, value)
    Reflect.defineMetadata('headers', existingHeaders, descriptor.value)
  };
}
