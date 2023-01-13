/*
 * @Author: water.li
 * @Date: 2023-01-04 22:41:07
 * @Description:
 * @FilePath: \Notebook\TypeScript\接口的使用.ts
 */

// 用来描述形状的 定义结构到时候让用户去实现

// 描述形状 （对象 类 函数 混合类型）
// 定义一些还没有实现的内容

// type IFullname = {
//   firstname: string;
//   lastname: string;
// }

interface IFullname {
  firstname: string;
  lastname: string;
}

const getFullName = ({ firstname, lastname }: IFullname) => {
  return firstname + lastname
}
getFullName({ firstname: 'li', lastname: 'water' })

/**
 * & type 和 interface的区别
 * interface 通常描述对象、类的结构比较多，type来描述函数的签名 联合类型 交叉类型 工具类型 映射条件类型
 * 在描述的时候 尽量用type 不能用时考虑interface
 * type 优点：可用用联合类型 type不能重名 type 中可以用后续的条件类型、映射
 * interface 能重名，可以被扩展和实现、继成 混合类型
 */

// 方法计数器 调用+1
// type ICount = () => number
interface ICount {
  (): number;
  count: number;
}
const counter: ICount = () => {
  return counter.count++
}
counter.count = 0


// 对象采用接口来实现 描述后端返回的数据结构
interface IVeg {
  color: string;
  taste: string;
  size: number;
  [key: string]: any;
}



// 1 断言后可以直接赋值

// 2 采用可选属性来标识

// 3 我在基于当前类型声明一个新的类型
// interface IVegWitdhX extends IVeg {
//   xxx: number;
// }

// 4 同名接口可以合并
// interface IVeg {
//   xxx: number
// }


let veg: IVeg = {
  color: 'red',
  taste: 'sour',
  size: 10,
  xxx: 1
}

// 可能通过索引访问符来访问接口中的属性类型
interface Person {
  name: string;
  age: number;
  address: {
    num: 316;
  }
}

type PersonName = Person['name']
type PersonNum = Person['address']['num'] // 316
type ProTypeUnion = keyof Person // 取key name |age | address
type ProTypeValueUnion = Person[keyof Person] // 取值 string|number|{num: 316}

// 类接口 描述类中的属性和方法
interface Speakable {
  speak(): void; // 原型方法
  say: () => void; // 实例方法 ,
  name: string;
}
interface SpeakChinese {
  speakChinese(): void; // 原型方法
}
interface SpeakEnglish extends Speakable {
  speakEnglish(): void;
}
class Speak implements SpeakEnglish, SpeakChinese {
  speakEnglish(): void {
    throw new Error("Method not implemented.");
  }
  name: string;
  speak(): void {

  }
  speakChinese(): void {

  }
  say: () => {}
}

// ! 描述实例类型，类类型描述的是实例，想获取到类本身的类型，需要采用typeof
class Animal { }

function createInstance(clazz: typeof Animal): Animal {
  return new clazz()
}

let instance = createInstance(Animal)

export { }