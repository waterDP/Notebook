export {};

// ts 默认在使用的时候 都是联合类型 不能直接使用联合类型 识别类型 针对某一种类型进行处理
// 对不同的类型进行范围缩小
// typeof 类型保护
// instanceof 类型保护
// in 类型保护
function double(a: string | number) {
  if (typeof a === "string") {
    return a + a;
  }
  return a * 2;
}

class Person {}
class Dog {}

function getInstance(clazz: new (...args: any[]) => Person | Dog) {
  return new clazz();
}

let p = getInstance(Person);

if (p instanceof Person) {
  p; // Person
} else {
  p; // Dog
}

interface Bird {
  fly: string;
  kind: "鸟";
}
interface Fish {
  swim: string;
  kind: "鱼";
}

function getType1(type: Bird | Fish) {
  if ("swim" in type) {
    type; // Fish
  } else {
    type; // Bird
  }
}

function getType2(type: Bird | Fish) {
  // 可辨识类型
  if (type.kind === "鱼") {
    type; // Fish
  } else {
    type; // Bird
  }
}

// 确保一个变量是数组
function ensureArray<T>(input: T | T[]): T[] {
  // 类型来变识
  if (Array.isArray(input)) {
    return input;
  }

  return [input];
}

// null 保护
function addPrefix(num?: number) {
  num = num || 0; // null 保护
  return function (prefix: string) {
    return prefix + num!.toFixed();
  };
}

let r = addPrefix(100)("$");

// & ts 中的is语法
interface Bird {
  fly: string;
  kind: "鸟";
}
interface Fish {
  swim: string;
  kind: "鱼";
}

// 工具方法中判断类型的方法 全部需要使用is语法
function isBird(val: Bird | Fish): val is Bird {
  return val.kind === "鸟";
}

function getType3(val: Bird | Fish) {
  if (isBird(val)) {
    // 是鸟是 true 还是false呢
    val; // Bird
  }
}

type unionUnknown = unknown | string | number | boolean; // unknown
type interUnknown = unknown & string; // string
