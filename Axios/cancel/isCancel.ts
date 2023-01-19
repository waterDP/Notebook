/*
 * @Author: water.li
 * @Date: 2023-01-19 11:02:37
 * @Description:
 * @FilePath: \Notebook\Axios\cancel\isCancel.ts
 */

import Cancel from "./Cancel";

export default function isCancel(val: any): boolean {
  return val instanceof Cancel;
}
