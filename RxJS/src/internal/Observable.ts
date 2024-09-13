import { Subscriber } from "./Subscriber";
import { Subscription } from './Subscription';

export class Observable<T> {
  private _subscribe: (this: any) => any;
  constructor(subscribe?: (this: any) => any) {
    if (subscribe) {
      this._subscribe = subscribe;
    }
  } 
  subscribe(observerOrNext?: any): Subscription {
    const subscriber =
      observerOrNext instanceof Subscriber
        ? observerOrNext
        : new Subscriber(observerOrNext);

    subscriber.add();
    return subscriber;
  }
}
