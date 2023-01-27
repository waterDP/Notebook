/*
 * @Author: water.li
 * @Date: 2023-01-11 21:52:05
 * @Description:
 * @FilePath: \Notebook\TypeScript\类型推断.ts
 */
export {};

// 类型推断

// todo 1 赋值推断
let name = "1223";
let map = {
  a: 12,
};
let age = 1;
let male = false;
// todo 2 类型推断从右边向左边
function sum(a: string, b: string) {
  // 函数的返回值可以自动推断
  return a + b;
}

// todo 3 反向推断 从左向右  上下文类型
type ISum = (x: string, y: string) => string;

const sum1: ISum = (a, b) => {
  return a + b;
};

type ICallback = (x: string, y: string) => void; // 不关心返回值
function fn(cb: ICallback) {
  let r = cb("1", "2"); // 调用函数不会根据返回值来推断，默认采用上下文中声明的类型
}
fn((a, b) => {
  return a + b;
});
