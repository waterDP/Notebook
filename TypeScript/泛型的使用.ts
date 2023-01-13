/*
 * @Author: water.li
 * @Date: 2023-01-04 23:59:00
 * @Description: 
 * @FilePath: \Notebook\TypeScript\泛型的使用.ts
 */

class Animal { }
class Meat { }
interface Clazz<T> {
  new(): T
}

function createInstance<T>(clazz: Clazz<T>) {
  return new clazz()
}

let intance = createInstance(Meat)

// 根据长度和内容创建一个数据
const getArray = <T>(times: number, val: T): T[] => {
  let ret: T[] = []
  for (let i = 0; i < times; i++) {
    ret.push(val)
  }
  return ret
}

getArray(3, 'abc') // ['abc', 'abc', 'abc']

// 多个泛型的使用 元祖交换
type ISwap = <T, U>(tuple: [T, U]) => [U, T]

const swap: ISwap = (tuple) => {
  return [tuple[1], tuple[0]]
}

let ret = swap(['jsi', 10])  // [10, 'jsi']

// forEach
type ICallback<T> = (item: T, idx: number) => void
type IForEach = <T>(arr: T[], callback: ICallback<T>) => void

const forEach: IForEach = (arr, callback) => {
  for (let i = 0; i < arr.length; i++) {
    callback(arr[i], i)
  }
}

forEach(['a', 'b', 'c'], function (item, idx) {
  console.log(item)
})

// 泛型可以指定默认值 
type Union<T = string> = T | number;

type T1 = Union
type T2 = Union<boolean>

// ^ 泛型约束  约束传入的泛型类型 A extends B A是B的子类
// 此方法 传入number -> umber
// 传入 string -> string
// 传入 boolean -> error
function handle<T extends number | string>(val: T): T {
  return val
}

let r1 = handle(123)
let r2 = handle('abc')
let r3 = handle(true)

interface IWithLength {
  length: number
}

function getLen<T extends IWithLength>(val: T) {
  return val.length
}

// 约束索引的签名
function getVal<T extends object, U extends keyof T>(obj: T, key: U) {
  return obj[key]
}

getVal({ a: 1, b: 2, c: 3 }, 'a')
