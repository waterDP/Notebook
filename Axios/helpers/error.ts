/*
 * @Author: water.li
 * @Date: 2023-01-18 22:17:54
 * @Description:
 * @FilePath: \Notebook\Axios\helpers\error.ts
 */

import { AxiosRequestConfig, AxiosResponse } from "../types";

export class AxiosError extends Error {
  constructor(
    message: string,
    private config: AxiosRequestConfig,
    private request?: any,
    private code?: string | null | number,
    private response?: AxiosResponse
  ) {
    super(message);
    Object.setPrototypeOf(this, AxiosError.prototype);
  }
}
