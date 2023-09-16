import { Subscriber } from "./Subscriber";

export class Observable {
  constructor(subscribe) {
    if (subscribe) {
      // 保存订阅函数 在创建实例的时候这个函数没有执行
      this._subscribe = subscribe;
    }
  }
  // 当调用Observable的subscribe的时候，就要开始执行
  subscribe(observerOrNext) {
    // 创建一个订阅都的对象
    const subscriber = new Subscriber(observer);
    // 订阅函数执行后会返回一个销毁函数
    const teardown = this._subscribe(subscriber);
    // 把销毁函数存放到subscriber
    subscriber.add(teardown);
    return subscriber;
  }
}
