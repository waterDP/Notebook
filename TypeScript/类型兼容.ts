/*
 * @Author: water.li
 * @Date: 2023-01-08 21:32:56
 * @Description:
 * @FilePath: \Notebook\TypeScript\类型兼容.ts
 */

// 兼容性，子类型可以赋于父类型
// ts中 结构化的类型系统 （鸭子类型检查）

interface IWithToString {
  toString(): string;
}
let obj: IWithToString;

// 这两个类型单从类型层级来看 是不存在父子关系的

let str: string = "abc"; // 兼容性

obj = str;

obj.substring();
obj.toString(); // 安全性 保证使用的时候不会发生异常

// !接口类型
interface IAnimal {
  name: string;
  age: number;
}
interface IPerson {
  name: string;
  age: number;
  address: string;
}
let animal: IAnimal;
let person: IPerson = {
  name: "diw",
  age: 9,
  address: "",
};
animal = person; // 子类赋于给父类 兼容 你要的我都有  安全

// !函数的兼容性
let sum1 = (a: string, b: string) => a + b;
let sum2 = (a: string) => a;

sum1 = sum2;

// 对于函数的参数来讲 少的参数可以赋予给多的 因为人家内部实现，传递了多个参数，但是我用的少  安全 如果我用的多就不安全了

let sum3!: () => string | number;
let sum4!: () => string;
sum3 = sum4;

class A {
  private name!: string;
  age!: number;
}

class B {
  private name!: string;
  age!: number;
}

let a: A = new B();

class AddType<S> {
  private _type!: S;
}
type NewType<T, S extends string> = T & AddType<S>;

type BTC = NewType<number, "btc">;
type USDT = NewType<number, "usdt">;

let btc: BTC = 100 as BTC;
let usdt: USDT = 100 as USDT;

function getCount(count: BTC) {
  return count;
}
getCount(usdt);
getCount(btc); // 标识类型

export {};
