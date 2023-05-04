import { isFunction } from "./util/isFunction";
export class Subscription {
  public closed = false;

  private _finalizers: any[] = [];

  unsubscribe() {
    if (!this.closed) {
      this.closed = true;
      for (let i = 0; i < this._finalizers.length; i++) {
        const item = this._finalizers[i];
        if (isFunction(item)) {
          item();
        }
        if (item instanceof Subscription) {
          this._finalizers.splice(i, 1);
        }
      }
    }
  }

  add(teardown) {
    if (teardown) {
      (this._finalizers = this._finalizers ?? []).push(teardown);
    }
  }
}
