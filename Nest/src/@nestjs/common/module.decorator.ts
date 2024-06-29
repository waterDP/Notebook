import "reflect-metadata";

interface ModuleMetadata {
  controllers: Function[];
}

// 定义模块装饰器
export function Module(metadata: ModuleMetadata): ClassDecorator {
  return (target: Function) => {
    Reflect.defineMetadata("controllers", metadata.controllers, target);
    // 给模块类添加元数据，AppModule元数据的名字叫controller, 值是controller数组
  };
}
