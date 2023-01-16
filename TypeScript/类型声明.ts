/*
 * @Author: water.li
 * @Date: 2023-01-13 20:53:00
 * @Description:
 * @FilePath: \Notebook\TypeScript\类型声明.ts
 */

// * 我们编写的类型，在最终编译打包的时候都会被删除，为了让别人拥有代码提示。

declare let age: number;

declare function sum(a: string, b: string): string;

declare class Person { };

declare const enum Season {
  Spring,
  Summer
}

declare interface Animal {
  name: string;
  age: number;
}

declare module "mitt" {
  type Type = string | symbol;
  type Listener = (...args: unknown[]) => void;
  const on: (type: Type, listener: Listener) => void;
  const emit: (type: Type, ...args: unknown[]) => void;
  const off: (type: Type, listener: Listener) => Listener;
}

declare module "*.jpg" {
  const str: string;
  export default str;
}

declare global { // 全局的空间
  interface String {
    double(): string
  }
}

String.prototype.double = () => {
  return (this as unknown as string) + this
}

export { }