/*
 * @Author: water.li
 * @Date: 2023-01-08 20:27:51
 * @Description:
 * @FilePath: \Notebook\TypeScript\infer的使用.ts
 */

// 类型推断 inference infer 推断
// infer 关键字只能用在条件类型中用来提取类型的某一部分的类型，放在不同的位置，就可以帮我们取不同位置的类型
function getUser(name: string, age: number) {
  return { name, age, address: {} };
}

type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;

type T1 = ReturnType<typeof getUser>;

type Parameters<T extends (...args: any[]) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : never;
type T2 = Parameters<typeof getUser>;

class Person {
  constructor() {
    return { a: 1, b: 2 };
  }
}

let p = new Person();

type InstanceType<T extends abstract new (...args: any[]) => any> = T extends {
  new (...args: any[]): infer I;
}
  ? I
  : never;
type T3 = InstanceType<typeof Person>;

type ConstructorParameters<T extends new (...args: any[]) => any> =
  T extends new (...args: infer P) => any ? P : never;
type T5 = ConstructorParameters<typeof Person>;

// 将元组转换成联合类型
type ElementOf<T> = T extends Array<infer R> ? R : never;
type TupleToUnion = ElementOf<[string, number, boolean]>;

type PromiseV<T> = T extends Promise<infer V> ? PromiseV<V> : T;
type PromiseReturnValue = PromiseV<Promise<Promise<number>>>;

export {};
