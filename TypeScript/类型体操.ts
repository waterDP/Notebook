/*
 * @Author: water.li
 * @Date: 2023-01-13 23:40:53
 * @Description:
 * @FilePath: \Notebook\TypeScript\类型体操.ts
 */

// ^ ReverseTuple
export type ReverseTuple<T extends any[], F extends any[] = []> = T extends [
  infer L,
  ...infer R
]
  ? ReverseTuple<R, [L, ...F]>
  : F;

type A1 = ReverseTuple<[string, number, boolean]>; // [boolean, number, string]
type B1 = ReverseTuple<[1, 2, 3]>; // [3, 2, 1]
type C1 = ReverseTuple<[]>; // []

// ^ Flat
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
type A7 = TupleToString<["1", "2", "3"]>; // 元组中只能放字符串

// ^ RepeatString
export type RepeatString<
  T extends string,
  C,
  A extends any[] = [],
  F extends string = ""
> = C extends A["length"] ? F : RepeatString<T, C, [...A, null], `${F}${T}`>;

type A8 = RepeatString<"a", 3>; // 'aaa'
type B8 = RepeatString<"a", 0>; // ''

// ^ SplitString
export type SplitString<
  T extends string,
  S extends string,
  F extends any[] = []
> = T extends `${infer L}${S}${infer R}`
  ? SplitString<R, S, [...F, L]>
  : [...F, T];

type A9 = SplitString<"handle-open-flag", "-">; // ['handle', 'open', 'flag']
type B9 = SplitString<"open-flag", "-">; // ['open', 'flag']
type C9 = SplitString<"handle.open.flag", ".">; // ['open', 'flag']

// ^ LengthOfString

export type LengthOfString<
  T extends string,
  A extends any[] = []
> = T extends `${infer L}${infer R}`
  ? LengthOfString<R, [...A, null]>
  : A["length"];

type A10 = LengthOfString<"BFE.dev">; // 7
type B10 = LengthOfString<"">; // 0

// ^ KebabCase

export type KebabCase<
  T extends string,
  F extends string = ""
> = T extends `${infer L}${infer R}`
  ? KebabCase<R, `${F}${Capitalize<L> extends L ? `-${Lowercase<L>}` : L}`>
  : RemoveFirst<F, "-">;

type RemoveFirst<T extends string, S> = T extends `${S & string}${infer R}`
  ? R
  : T;

type A11 = KebabCase<"HandleOpenFlag">; // 'handle-open-flag'
type B11 = KebabCase<"OpenFlag">; // open-flag

// ^ CamelCase
export type CamelCase<
  T extends string,
  F extends string = ""
> = T extends `${infer L}-${infer R1}${infer R2}`
  ? CamelCase<R2, `${F}${L}${Capitalize<R1>}`>
  : Capitalize<`${F}${T}`>;

type A12 = CamelCase<"handle-open-flag">; // HandleOpenFlag
type B12 = CamelCase<"open-flag">; // 'OpenFlag'

// ^ Replace
export type Replace<
  T extends string,
  C extends string,
  RC extends string,
  F extends string = ""
> = C extends ""
  ? T extends ""
    ? RC
    : `${RC}${T}`
  : T extends `${infer L}${C}${infer R}`
  ? Replace<R, C, RC, `${F}${L}${RC}`>
  : `${F}${T}`;

type A13 = Replace<"ha ha ha", "ha", "he">;
type B13 = Replace<"hr", "hr", "hrao">;
type C13 = Replace<"a", "", "he">;
type D13 = Replace<"", "", "heheh">;

// ^ OptionalKeys
export type OptionalKeys<T, K = keyof T> = K extends keyof T //
  ? Omit<T, K> extends T // 将当前每次分发后的属性忽略掉看是否能赋予给原来的T
    ? K // 如果可以说明这个属性是可选的
    : never
  : never;

type A14 = OptionalKeys<{
  foo: number | number;
  bar?: string;
  flag: boolean;
}>; // bar
type B14 = OptionalKeys<{ foo: number; bar?: string }>; // bar
type C14 = OptionalKeys<{ foo: number; flag: boolean }>; // never
type D14 = OptionalKeys<{ foo?: number; flag?: boolean }>; // foo|flag
type E14 = OptionalKeys<{}>; // never

// ^ UnionToIntersection 联合转交叉 利用函数的逆变
export type UnionToIntersection<T> = (
  T extends any ? (a: T) => void : never
) extends (b: infer R) => void
  ? R
  : never;
type A15 = UnionToIntersection<{ a: string } | { b: string } | { c: string }>;
// {a: string} & {b: string} & {c: string}

// ^ Add
export type Add<
  A extends number,
  B extends number,
  AA extends any[] = [],
  BA extends any[] = [],
  R extends any[] = []
> = AA["length"] extends A
  ? BA["length"] extends B
    ? R["length"]
    : Add<A, B, AA, [...BA, null], [...R, null]>
  : Add<A, B, [...AA, null], BA, [...R, null]>;

type Ar16 = Add<1, 2>;

// ^ Fibonacci 斐波拉契数列
export type Fibonacci<
  Target extends number,
  CurrentIndex extends number = 1,
  CurrentCount extends number = 1,
  BeforeCount extends number = 0
> = Target extends CurrentIndex
  ? CurrentCount
  : Fibonacci<
      Target,
      Add<CurrentIndex, 1>,
      Add<CurrentCount, BeforeCount>,
      CurrentCount
    >;
type F17 = [
  Fibonacci<1>,
  Fibonacci<2>,
  Fibonacci<3>,
  Fibonacci<4>,
  Fibonacci<9>
];
