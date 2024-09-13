import { isFunction } from "./isFunction";

export function isPromise(value) {
  return isFunction(value.then);
}
