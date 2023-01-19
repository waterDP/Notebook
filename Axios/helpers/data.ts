/*
 * @Author: water.li
 * @Date: 2023-01-18 21:06:56
 * @Description:
 * @FilePath: \Notebook\Axios\helpers\data.ts
 */

import { isObject } from "./util";

export function transformRequest(data: any): any {
  if (isObject(data)) {
    return JSON.stringify(data);
  }

  return data;
}

export function transformResponse(data: any): any {
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch (e) {
      // do nothing
    }
  }
  return data;
}
