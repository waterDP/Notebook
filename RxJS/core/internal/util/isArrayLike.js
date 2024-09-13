/*
 * @Author: water.li
 * @Date: 2023-09-16 13:00:35
 * @Description:
 * @FilePath: \Notebook\RxJS\source\internal\util\isArrayLike.js
 */

export function isArrayLike(x) {
  return x && typeof x.length === "number" && typeof x !== "function";
}
