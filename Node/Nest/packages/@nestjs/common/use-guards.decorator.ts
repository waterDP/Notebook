import "reflect-metadata";

export function useGuards(...guards) {
  return (
    target: object | Function,
    propertyKey?: string,
    descriptor?: TypedPropertyDescriptor<any>
  ) => {
    if (descriptor) {
      // 装饰一个方法
      Reflect.defineMetadata("guards", guards, descriptor.value);
    } else {
      // 装饰一个类
      Reflect.defineMetadata("guards", guards, target);
    }
  };
}
