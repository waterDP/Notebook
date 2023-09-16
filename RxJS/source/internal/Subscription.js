export class Subscription {
  _finalizers = [];
  unsubscribe() {
    const { _finalizers } = this;
    for (const finallizer of _finalizers) {
      finallizer();
    }
  }
  add(teardown) {
    this._finalizers.push(teardown);
  }
}
