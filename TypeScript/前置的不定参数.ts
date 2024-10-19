export {};

type JSTypeMap = {
  string: string;
  number: number;
  boolean: boolean;
  object: object;
  symbol: symbol;
  bigint: bigint;
  undefined: undefined;
  null: null;
};

type JSTypeNames = keyof JSTypeMap;

type ArgsType<T extends JSTypeNames[]> = {
  [I in keyof T]: JSTypeMap[T[I]];
};

declare function addImpl<T extends JSTypeNames[]>(
  ...args: [...T, (...args: ArgsType<T>) => any]
): void;

addImpl("boolean", "string", "number", (a, b, c) => {});
