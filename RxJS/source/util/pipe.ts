import { identity } from "./identity";

export function pipeFromArray<T, R>(fns: any[]): any {
  if (fns.length === 0) {
    return identity;
  }
  if (fns.length === 1) {
    return fns[0];
  }

  return function piped(input: T): R {
    return fns.reduce((prev, fn) => fn(prev), input);
  };
}
