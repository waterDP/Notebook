const Rx = require("rxjs");

const button = document.querySelector("button");

Rx.Observable.fromEvent(button, "click")
  .throttleTime(1000) // 节流
  .map((event) => event.clientX)
  .scan((count, clientX) => count + clientX, 0) // 等价于reduce
  .subscribe((count) => console.log(count));
