/*
 * @Author: water.li
 * @Date: 2023-01-19 09:21:33
 * @Description:r
 * @FilePath: \Notebook\Axios\core\InterceptorManager.ts
 */

import { RejectedFn, ResolvedFn } from "../types";

type Interceptor<T> = {
  resolved: ResolvedFn<T>;
  rejected?: RejectedFn;
};

export class InterceptorManager<T> {
  handlers: Array<Interceptor<T> | null> = [];

  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number {
    this.handlers.push({
      resolved,
      rejected,
    });
    return this.handlers.length - 1; // 当前拦截器的索引
  }

  eject(id: number): void {
    if (this.handlers[id]) {
      this.handlers[id] = null; // ^ 简单粗暴
    }
  }

  clear(): void {
    if (this.handlers) {
      this.handlers = [];
    }
  }

  forEach(fn): void {
    this.handlers.forEach((h) => {
      if (h !== null) {
        fn(h);
      }
    });
  }
}
