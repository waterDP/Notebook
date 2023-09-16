import { Observable } from "../Observable";
import { asyncScheduler } from "../scheduler/async";

export function timer(dueTime, interval, scheduler = asyncScheduler) {
  return Observable((subscriber) => {
    let n = 0;
    return scheduler.schedule(function () {
      subscriber.next(n++);
      if (interval > 0) {
        this.schedule(undefined, interval);
      } else {
        subscriber.complete();
      }
    }, dueTime);
  });
}
