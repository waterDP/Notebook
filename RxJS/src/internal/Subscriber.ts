import { Subscription } from "./Subscription";
import { Observer } from "./types";
import { isFunction } from "./utils/isFunction";

export class Subscriber<T> extends Subscription implements Observer<T> {
  protected isStopped: boolean = false;
  protected destination: Observer<T>;
  constructor(
    destination?:
      | Subscriber<T>
      | Partial<Observer<T>>
      | ((value: T) => void)
      | null
  ) {
    super();
    this.destination =
      destination instanceof Subscriber
        ? destination
        : createSafeSubscriber(destination);
  }
  next(value: T) {
    if (this.isStopped) {
    } else {
      this._next(value);
    }
  }
  error: (err: any) => void;
  complete: () => void;

  protected _next(value: T): void {
    this.destination.next(value);
  }
}

class ConsumerSubscriber<T> implements Observer<T> {
  constructor(private partialObserver: Partial<Observer<T>>) {}
  next: (value: T) => void;
  error: (err: any) => void;
  complete: () => void;
}

function createSafeSubscriber<T>(
  observerOrNext?: Partial<Observer<T>> | ((value: T) => void) | null
): Observer<T> {
  const partialObserver =
    !observerOrNext || isFunction(observerOrNext)
      ? { next: observerOrNext ?? undefined }
      : observerOrNext;

  return new ConsumerSubscriber(partialObserver);
}
