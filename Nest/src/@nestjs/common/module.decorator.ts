/*
 * @Author: water.li
 * @Date: 2024-06-27 21:35:24
 * @Description:
 * @FilePath: \Notebook\Nest\src\@nestjs\common\module.decorator.ts
 */
import "reflect-metadata";

interface ModuleMetadata {
  controllers?: Function[];
  providers?: any[];
  exports?: any[]; // 模块的导出 可以把自己的一部分providers导出给别的模块用
  imports?: any[]; // 导入的模块 可以导入别模块，把别的模块的导出的providers给自己用
}

// 定义模块装饰器
export function Module(metadata: ModuleMetadata): ClassDecorator {
  return (target: Function) => {
    Reflect.defineMetadata("isModule", true, target);
    // 给模块类添加元数据，AppModule元数据的名字叫controller, 值是controller数组
    Reflect.defineMetadata("controllers", metadata.controllers, target);
    // 给模块类添加元数据 providers
    Reflect.defineMetadata("providers", metadata.providers, target);
    Reflect.defineMetadata("exports", metadata.exports, target);
    Reflect.defineMetadata("imports", metadata.imports, target);
  };
}
