/*
 * @Author: water.li
 * @Date: 2023-09-16 13:09:22
 * @Description:
 * @FilePath: \Notebook\RxJS\source\internal\observable\fromEvent.js
 */

import { Observable } from "../Observable";

export function fromEvent(target, eventName) {
  return new Observable((subscriber) => {
    const handler = (...args) => subscriber.next(...args);
    target.eventListener(eventName, handler);
  });
}
