/*
 * @Author: water.li
 * @Date: 2023-01-19 10:37:34
 * @Description:
 * @FilePath: \Notebook\Axios\core\transform.ts
 */

import { AxiosTransformer } from "../types";

export default function transform(
  data: any,
  headers: any,
  fns?: AxiosTransformer | AxiosTransformer[]
) {
  if (!fns) {
    return data;
  }
  if (!Array.isArray(fns)) {
    fns = [fns];
  }
  fns.forEach((fn) => {
    data = fn(data, headers);
  });
  return data;
}
