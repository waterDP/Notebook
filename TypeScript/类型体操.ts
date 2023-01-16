/*
 * @Author: water.li
 * @Date: 2023-01-13 23:40:53
 * @Description:
 * @FilePath: \Notebook\TypeScript\类型体操.ts
 */

// ^ 返转
export type ReverseTuple<T extends any[], F extends any[] = []> = T extends [
  infer L,
  ...infer R
]
  ? ReverseTuple<R, [L, ...F]>
  : F;

type A1 = ReverseTuple<[string, number, boolean]>; // [boolean, number, string]
type B1 = ReverseTuple<[1, 2, 3]>; // [3, 2, 1]
type C1 = ReverseTuple<[]>; // []

// ^ 展平
export type Flat<T extends any[]> = T extends [infer L, ...infer R]
  ? [...(L extends any[] ? Flat<L> : [L]), ...Flat<R>]
  : [];

type A2 = Flat<[1, 2, 3]>; // [1,2,3]
type B2 = Flat<[1, [2, 3], [4, [5, [6]]]]>; // [1,2,3,4,5,6]
type C2 = Flat<[1]>; // [1]

// ^ Repeat
export type Repeat<T, C, F extends any[] = []> = C extends F["length"]
  ? F
  : Repeat<T, C, [...F, T]>;

type A3 = Repeat<number, 3>; // [number, number, number]
type B3 = Repeat<string, 2>; // [string, string, string]
type C3 = Repeat<1, 1>; // [1]
type D3 = Repeat<0, 0>; // [0]

// ^ Filter
export type Filter<T extends any[], U, F extends any[] = []> = T extends [
  infer L,
  ...infer R
]
  ? Filter<R, U, [L] extends [U] ? [...F, L] : F>
  : F;

type A4 = Filter<[1, "BFE", 2, true, "dev"], number>; // [1, 2]
type B4 = Filter<[1, "BFE", 2, true, "dev"], string>; // ['BFE', 'dev']
type C4 = Filter<[1, "BFE", 2, any, "dev"], number>; // [BFE', any, 'dev']

type isEqual<T, U, Success, Fail> = [T] extends [U]
  ? [U] extends [T]
    ? keyof T extends keyof U
      ? keyof U extends keyof T
        ? Success
        : Fail
      : Fail
    : Fail
  : Fail;

export type FindIndex<T extends any[], A, F extends any[] = []> = T extends [
  infer L,
  ...infer R
]
  ? isEqual<L, A, F["length"], FindIndex<R, A, [...F, null]>>
  : never;
type a1 = [any, never, 1, "2", true];
type a2 = FindIndex<a1, 1>; // 2
type a3 = FindIndex<a1, 2>; // never

// ^ Slice
export type Slice<
  T extends any[],
  S extends number, // 开始位置
  E extends number = T["length"], // 结束位置
  SA extends any[] = [], // 用于记录是否到达S
  EA extends any[] = [], // 用于记录是否到达E
  F extends any[] = []
> = T extends [infer L, ...infer R]
  ? SA["length"] extends S // 看一下开头是否满足传入的开头，如果满足则放入队列中，并且再截取后面的
    ? EA["length"] extends E // 如果放入的索引到达结尾意味着放完了，那就把当前的这一项放到数组的结束位置
      ? [...F, L]
      : Slice<R, S, E, SA, [...EA, null], [...F, L]>
    : Slice<R, S, E, [...SA, null], [...EA, null], F>
  : F;

type S1 = Slice<[any, never, 1, "2", true, boolean], 0, 2>; // [any, never, 1]
type S2 = Slice<[any, never, 1, "2", true, boolean], 1, 3>; // [never, 1, '2']
type S3 = Slice<[any, never, 1, "2", true, boolean], 1, 2>; // [never, 1]
type S4 = Slice<[any], 2>; // []
type S5 = Slice<[], 0>; // []

// ^ LastChar
export type LastChar<
  T extends string,
  F = never
> = T extends `${infer L}${infer R}` ? LastChar<R, L> : F;
type A5 = LastChar<"ABC">; // 'C'
type B5 = LastChar<"dev">; // 'v'
type C5 = LastChar<"">; // never

// ^ StringToTuple
export type StringToTuple<
  T extends string,
  F extends any[] = []
> = T extends `${infer L}${infer R}` ? StringToTuple<R, [...F, L]> : F;
type A6 = StringToTuple<"abdus,lce">;

// ^ TupleToString
export type TupleToString<T, F extends string = ""> = T extends [
  infer L,
  ...infer R
]
  ? TupleToString<R, `${F}${L & string}`>
  : F;
