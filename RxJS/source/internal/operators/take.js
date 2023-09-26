/*
 * @Author: water.li
 * @Date: 2023-09-16 14:34:36
 * @Description:
 * @FilePath: \Notebook\RxJS\source\internal\operators\take.js
 */
import { Observable } from "../Observable";

export function map(count) {
  // operation
  return (source) => {
    // 记数器 用来记录已经获取的值的数量
    let seen = 0;
    return new Observable((subscriber) => {
      return source.subscribe({
        ...subscriber,
        // ! 最关键的是要重写next方法
        // 此value是老的Observable传过来的老值
        next: (value) => {
          seen++;
          if (seen <= count) {
            subscriber.next(value);
            if (seen >= count) {
              subscriber.complete();
            }
          }
        },
      });
    });
  };
}
