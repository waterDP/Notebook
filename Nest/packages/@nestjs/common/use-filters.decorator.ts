import "reflect-metadata";
import { ExceptionFilter } from "./exception-filter.interface";

export function UseFilters(...filters: ExceptionFilter[]): ClassDecorator | MethodDecorator  {
  return (target: object | Function, propertyKey?: string|symbol, descriptor?: any) => {
    if (descriptor) {
      // 如果方法装饰器，绑到方法上
      Reflect.defineMetadata("filters", filters, descriptor.value);
    } else {
      // 如果是类装饰器，绑到类上
      Reflect.defineMetadata("filters", filters, target);
    }
  };
}
