/*
 * @Author: water.li
 * @Date: 2023-01-05 22:48:06
 * @Description:
 * @FilePath: \Notebook\TypeScript\条件分发.ts
 */

// 条件类型 extends 约束 经常和条件一起使用
// 条件类型的格式可以看成是三元表达式

type ResStatusMessage<T> = T extends 200 | 201 | 204 | 206 ? "success" : "fail";

type IMessage = ResStatusMessage<200>;
// 对于联合类型而言子类型是其中的任何一个
// 交叉后的结果就是交叉前的某个类型的子类型 Exclude Extract

type Conditional<T, U> = T extends U ? true : false;

type FormatReturnValue<T> = T extends string
  ? string
  : T extends number
  ? number
  : never;
function sum<T extends string | number>(a: T, b: T): FormatReturnValue<T> {
  return a + (b as any);
}
let r = sum(1, 2);

/**
 * ^ extends 父子关系 （类型等级）
 * never和字面量的关系
 * 字面量类型和基础类型的关系
 * 基础类型和包装类型
 */

// * never和字面量的关系
// never是最底端的类型 即never可以是任何类型的子类型
type T1 = never extends "123" ? true : false; // 子类型可以赋予给父类型
let a: number = (function (): never {
  throw new Error();
})();

// * 字面量类型和基础类型的关系 字面量类型肯定是基础类型的子类型
type T2 = 123 extends number ? true : false;
type T3 = "abc" extends string ? true : false;

// * 基础类型和包装类型 基础类型是包装类型的子类型
type T4 = string extends String ? true : false;
type T5 = String extends Object ? true : false;

// * any 所有类型都是any和unknown的子类型 any == unknown 顶端类型
type T6 = Object extends unknown ? true : false;

interface Fish {
  name: "鱼";
}

interface Water {
  type: "水";
}

interface Bird {
  name: "鸟";
}

interface Sky {
  type: "天空";
}

type SelectType<T> = T extends Fish ? Water : Sky;

type F7 = SelectType<Bird | Fish>;
type F8 = Bird | Fish extends Fish ? Water : Sky;

/**
 * & 分发机制
 * 1.通过泛型传入的方式来比较的时候会出现分发
 * 2.类型需要是联合类型 |
 * 3.类型需要完全的裸露出来
 *
 * never做比较的暑假 也会有分发问题
 *   any 默认分发
 *   never 默认只有通过泛型传递的时候会返回never
 */
type NoDistribute<T> = T & {};
type UnionAssets<T, U> = NoDistribute<T> extends U ? true : false;

type T8 = UnionAssets<1 | 2, 1 | 2 | 3>;
type T9 = UnionAssets<1 | 2 | 3, 1 | 2>;

// 如果判断两个类型完全相等
type IsEqual<T, U, Success, Fail> = NoDistribute<T> extends U
  ? NoDistribute<U> extends T
    ? Success
    : Fail
  : Fail;

type T10 = IsEqual<1 | 2, 1 | 2, true, false>;

// never   作比较的时候，也会有分发的问题
// - any   默认分发
// - never 默认只通过泛型传递的时候会返回never
type isNever<T> = NoDistribute<T> extends never ? true : false;
type T11 = isNever<never>;

// ^ 内置的条件类型 Extract Exclude NonNullable 集合操作

// & 获取两个联合类型的交集 Extract
type Extract<T, U> = T extends U ? T : never; // 分发
type E1 = Extract<string | number, string | number | boolean>;

// & 差集 Exclude
type Exclude<T, U> = T extends U ? never : T;
type E2 = Exclude<string | number | boolean, string | number | symbol>;

// 补集 差集+子类的关系
type Complement<T, U extends T> = T extends U ? never : T;
type E3 = Complement<string | number | boolean, string>;

let ele = document.getElementById("root");
type NonNullable<T> = T extends null | undefined ? never : T;
type EleElement = NonNullable<typeof ele>;

export {};
