import { from } from "./from.js";

export function of(...args) {
  return from(args);
}
