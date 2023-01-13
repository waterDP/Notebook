/*
 * @Author: water.li
 * @Date: 2023-01-08 22:39:27
 * @Description: 
 * @FilePath: \Notebook\TypeScript\逆变与协变.ts
 */

class Parent {
  house() { }
}

class Child extends Parent {
  car() { }
}

class Grandson extends Child {
  sleep() { }
}

function fn(callback: (instance: Child) => Child) {

}

// & 逆变 参数可以传父类型 
// & 协变 返回值可以是子类型

fn((instance: Parent): Grandson => {
  return new Grandson()
})

type Arg<T> = (arg: T) => void
type Return<T> = (arg: any) => T

type isArg = Arg<Parent> extends Arg<Child> ? true : false // ~逆变
type isReturn = Return<Grandson> extends Return<Child> ? true : false // ~协变

// ^ 逆变带来的问题
interface Array<T> {
  // concat: (...args: T[]) => T[];
  concat(...args: T[]): T[]; // 这种写法禁用了逆变的效果 不去检测逆变问题 
  [key: number]: T;
}
let parentArr!: Array<Parent>
let childArr!: Array<Child>

// parent[] <- child[]
parentArr = childArr


// 泛型的兼容性 泛型比较的是最终的结果 比较的是泛型传递的参数
interface II<T> {
  a: T
}
let a1!: II<string>
let a2!: II<number>

a1 = a2

type xx = II<string> extends II<number> ? true : false

// 枚举永远不兼容 不能将一个枚举赋予给另一个枚举


export { }