/*
 * @Author: water.li
 * @Date: 2024-09-01 20:54:19
 * @Description:
 * @FilePath: \Notebook\Nest\src\@nestjs\common\set-metadata.decorator.ts
 */
import "reflect-metadata";

export function SetMetadata(metadataKey, metadataValue) {
  return (
    target: object | Function,
    propertyKey?: string,
    descriptor?: TypedPropertyDescriptor<any>
  ) => {
    if (descriptor) {
      // 装饰一个方法
      Reflect.defineMetadata(metadataKey, metadataValue, descriptor.value);
    } else {
      // 装饰一个类
      Reflect.defineMetadata(metadataKey, metadataValue, target);
    }
  };
}
