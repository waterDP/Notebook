/*
 * @Author: water.li
 * @Date: 2023-04-21 22:40:14
 * @Description:
 * @FilePath: \Notebook\RxJS\source\util\identity.ts
 */
/**
 *
 * @param x Any value that is returned by this function
 * @returns The value passed as the first parameter to this function
 */
export function identity<T>(x: T): T {
  return x;
}
