/*
 * @Author: water.li
 * @Date: 2023-01-14 22:52:26
 * @Description:
 * @FilePath: \Notebook\TypeScript\模板字符串类型.ts
 */

export {};

type name = "jw"; // 模板字符串目的就是将多个字符串组装在一起
type sayHaha = `hi ${name} haha`;

// *模板字符串具备一个分发的机制
// * margin-top margin-right margin-bottom margin-left

type Direction = "left" | "top" | "right" | "bottom";
type AllMargin = `margin-${Direction}`;

type IColor = "red" | "yellow" | "green";
type ISize = 100 | 200 | 300;
type ProductSKU = `${IColor}-${ISize}`;

type sayHehe<T extends string | number> = `hehe ${T}`;
type v1 = sayHehe<"lr">;
type v2 = sayHehe<123>;

type Person = { name: string; age: number; address: string };
type RenamePerson<T, X extends keyof T> = {
  [K in keyof T as K extends X ? `rename_${K & string}` : K]: T[K];
};

type a1 = RenamePerson<Person, "name">;

// * 针对模板字符串，内部有很多专门的类型  可以供我们使用
// Uppercase Lowercase Capitalize(首字母大写) Uncapitalize(首字母转小写)
type PersonGetter<T> = {
  [K in keyof T as `get${Capitalize<K & string>}`]: () => T[K];
};
let person!: PersonGetter<Person>;

person.getName();
person.getAge();
person.getAddress();

type GristFirstName<S extends string> = S extends `${infer L} ${string}`
  ? L
  : any;

let FirstName: GristFirstName<"water li">;
