import Rx from "rxjs";

let liveStreaming$ = Rx.Observable.interval(1000).take(5);

liveStreaming$.subscribe(
  (data) => console.log("subscribe from first second"),
  (err) => console.log(err),
  () => console.log("completed")
);

setTimeout(() => {
  liveStreaming$.subscribe(
    (data) => console.log("subscribe from 2nd second"),
    (err) => console.log(err),
    () => console.log("completed")
  );
}, 2000);

// 事实上两个订阅者接收到的值都是0, 1, 2, 3, 4 此为冷观察

let liveStreaming1$ = Rx.Observable.interval(1000).take(5).publish();

liveStreaming1$.subscribe(
  (data) => console.log("subscribe from first second"),
  (err) => console.log(err),
  () => console.log("completed")
);

setTimeout(() => {
  liveStreaming1$.subscribe(
    (data) => console.log("subscribe from 2nd second"),
    (err) => console.log(err),
    () => console.log("completed")
  );
}, 2000);

// 第一个订阅者接收到的值都是0, 1, 2, 3, 4 而第二个输出的是3, 4 此为热观察
