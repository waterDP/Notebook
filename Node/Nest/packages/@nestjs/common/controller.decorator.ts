/*
 * @Author: water.li
 * @Date: 2024-06-27 21:37:09
 * @Description:
 * @FilePath: \Notebook\Nest\src\@nestjs\common\controller.decorator.ts
 */

import "reflect-metadata";

interface ControllerOptions {
  prefix?: string;
}

export function Controller(): ClassDecorator;
export function Controller(prefix: string): ClassDecorator;
export function Controller(options: ControllerOptions): ClassDecorator;
export function Controller(
  prefixOrOptions?: string | ControllerOptions
): ClassDecorator {
  let options: ControllerOptions = {};
  if (typeof prefixOrOptions === "string") {
    options.prefix = prefixOrOptions;
  } else if (typeof prefixOrOptions === "object") {
    options = prefixOrOptions;
  }

  // 这是一类装饰器，装饰的控制器这个类
  return (target: Function) => {
    // 给控制器类添加prefix路径前缀元数据
    Reflect.defineMetadata("prefix", options.prefix || "", target);
  };
}
