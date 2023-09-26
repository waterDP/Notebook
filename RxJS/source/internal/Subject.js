import { Observable } from "./Observable";

export class Subject extends Observable {
  observers = [];
  _subscribe(observer) {
    this.observers.push(observer);
  }
  next(value) {
    for (const observer of this.observers) {
      observer.next(value);
    }
  }
  complete() {
    for (const observer of this.observers) {
      observer.complete();
    }
  }
}
