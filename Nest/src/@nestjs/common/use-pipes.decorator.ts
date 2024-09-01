/*
 * @Author: water.li
 * @Date: 2024-09-01 13:59:54
 * @Description:
 * @FilePath: \Notebook\Nest\src\@nestjs\common\use-pipes.decorator.ts
 */
import "reflect-metadata";
import { PipeTransform } from "./pipe-transform.interface";

export function UsePipes(...pipes: PipeTransform[]) {
  return (
    target: object | Function,
    propertyKe?: string,
    descriptor?: TypedPropertyDescriptor<any>
  ) => {
    if (descriptor) {
      // 装饰的是一个方法
      Reflect.defineMetadata("pipes", pipes, descriptor.value);
    } else {
      // 装饰的是一个类
      Reflect.defineMetadata("pipes", pipes, target);
    }
  };
}
