import "reflect-metadata";

interface ModuleMetadata {
  controllers: Function[];
  providers?: any[];
}

// 定义模块装饰器
export function Module(metadata: ModuleMetadata): ClassDecorator {
  return (target: Function) => {
    // 给模块类添加元数据，AppModule元数据的名字叫controller, 值是controller数组
    Reflect.defineMetadata("controllers", metadata.controllers, target);
    // 给模块类添加元数据 providers
    Reflect.defineMetadata("providers", metadata.providers, target);
  };
}
