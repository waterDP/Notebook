/*
 * @Author: water.li
 * @Date: 2023-01-11 23:04:36
 * @Description:
 * @FilePath: \Notebook\TypeScript\内置类型.ts
 */
// 内置类型 Exclude Extract NonNullable infer ReturnType Paramters InstanceType

export { }

type A1 = {
  name: string
}
type A2 = {
  age: number
}

type Compute<T extends object> = {
  [K in keyof T]: T[K]
}

type A1A2 = Compute<A1 & A2>

interface Company {
  num: number;
  name: string
}
interface Person<T = any> {
  name: string;
  age: number;
  company: T
}
type WithCompany = Person<Company>

type Partial<T> = {
  [K in keyof T]?: T[K]
}

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}
type P = Partial<WithCompany>

interface Animal {
  name?: string;
  age?: number;
}

type Required<T> = {
  [K in keyof T]-?: T[K]
}
type DeepRequired<T> = {
  [K in keyof T]-?: T[K] extends object ? DeepRequired<T[K]> : T[K]
}

type Req = Required<Animal>

type Readonly<T> = {
  readonly [K in keyof T]: T[K]
}
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K]
}

type DeepMutate<T> = {
  -readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K]
}

// ^ Pick 挑选 Omit 剔除

type Pick<T, K extends keyof T> = {
  [P in K]: T[P]
}
type PickPerson = Pick<Person, 'name' | 'age'>

type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>
type OmitPerson = Omit<Person, 'name' | 'age'>

// & Record
let obj: object = {
  name: 'lish',
  age: 23
}

function map<K extends keyof any, V, R>(
  obj: Record<K, V>,
  callback: (item: V, key: K) => R
) {
  let ret = {} as Record<K, R>
  for (let key in obj) {
    ret[key] = callback(obj[key], key)
  }
  return ret
}
// 1 根据传入的值时行类型推导 name和age 会赋予给K 值赋予给V
// 2 拿到callback的返回值 R会根据你返回值来的推导 string
// 3 映射成一个新的record 这个新的record由K和R组成
map({ name: 'jiw', age: 12 }, (item, key) => {
  return item + key
})

type Record<K extends keyof any, T> = {
  [P in K]: T
}