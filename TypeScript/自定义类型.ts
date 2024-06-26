/*
 * @Author: water.li
 * @Date: 2023-01-12 21:38:27
 * @Description:
 * @FilePath: \Notebook\TypeScript\自定义类型.ts
 */

export {};

// * Exclude(排除) Extract(提取) 集合的操作
// * Pick Omit 对对象结构的操作
// * Partial Required Readonly 起修饰作用的
// * ReturnType Paramaters InstanceType ... (基于infer)

interface Person {
  name: string;
  age: number;
  company: string;
}

type Compute<T extends object> = {
  [K in keyof T]: T[K];
};

// ? 让部分属性变为可选的

// 先将name属性挑出来变为可选的 & 除了name属性的
type PartialPropsOptional<T, K extends keyof T> = Partial<Pick<T, K>> &
  Omit<T, K>;

type T1 = PartialPropsOptional<Person, "name">;
type CT1 = Compute<T1>;

// ? 根据值的类型来选择key
type IsEqual<T, U, Success, Fail> = [T] extends [U]
  ? [U] extends [T]
    ? Success
    : Fail
  : Fail;

type ExtractKeysByValueType<T, U> = {
  [K in keyof T]: IsEqual<T[K], U, K, never>;
}[keyof T]; // 找到需要的属性

type T2 = ExtractKeysByValueType<Person, string>;

type PickKeysByValue<T, U> = Pick<T, ExtractKeysByValueType<T, U>>;

type T3 = PickKeysByValue<Person, string>;

type OmitKeysByValueType<T, U> = {
  [K in keyof T]: IsEqual<T[K], U, never, K>;
}[keyof T];

type OmitKeysByValue<T, U> = Pick<T, OmitKeysByValueType<T, U>>;

type T4 = OmitKeysByValue<Person, string>;

// ! as 重映射
type PickKeysByValueType<T extends object, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};
type T5 = PickKeysByValueType<Person, string>;

type A = {
  name: string;
  age: number;
  address: string;
};

type B = {
  name: string;
  male: boolean;
  address: number;
};

// & 求交集 {name: string, address: number}

type ObjectInter<T extends object, U extends object> = Pick<
  U,
  Extract<keyof T, keyof U>
>;

type xx1 = ObjectInter<A, B>;

// & 求差集 B - A
type ObjectDiff<T extends object, U extends object> = Omit<
  U,
  Extract<keyof T, keyof U>
>;
type xx2 = ObjectDiff<A, B>;

type A1 = {
  name: string;
  age: number;
  address: string;
};

type B1 = {
  name: string;
  address: string;
};

// & 求补集  求B1在A1中的补集
type ObjectComp<T extends object, U extends T> = Omit<
  U,
  Extract<keyof T, keyof U>
>;
type xx3 = ObjectComp<B1, A1>;

// todo 重写A类型
type A2 = {
  name: string;
  age: number;
  address: string;
};

type B2 = {
  name: string;
  address: number;
  male: boolean;
};

type OverWrite<T extends object, U extends object> = ObjectInter<A2, B2> &
  ObjectDiff<B2, A2>;

type x4 = OverWrite<A2, B2>;
type r = Compute<x4>;

// ? 类型互斥问题
interface Man1 {
  fortune: string; // 有钱的
}

interface Man2 {
  funny: string; // 风趣的
}

interface Man3 {
  foreign: string;
}

type ManType = Man1 | Man2 | Man3;

let man: ManType = {
  fortune: "有钱",
  funny: "有趣",
  foreign: "有品",
};

type Discard<T, U> = {
  [K in Extract<keyof U, keyof T>]?: never;
};

type OnceType<T, U> = (Discard<T, U> & T) | (Discard<U, T> & U);

type OnceManType = OnceType<Man1, Man2>;
