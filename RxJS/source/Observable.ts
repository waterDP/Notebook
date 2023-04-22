import { pipeFromArray } from "./util/pipe";

export class Observable<T> {
  source: Observable<any> | undefined;

  protected _subscribe: any;
  constructor(_subscribe?) {
    if (_subscribe) {
      this._subscribe = _subscribe;
    }
  }

  // 静态函数创建 Observeable
  static create(subscribe) {
    return new Observable(subscribe);
  }

  // pipe 管道
  pipe(...operations: Function[]): Observable<any> {
    return pipeFromArray(operations)(this);
  }

  // subscribe()：执行初始化传入的 _subscribe
  subscribe(next, error, complete) {
    
  }
}
