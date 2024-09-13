import { Observable } from "../Observable";
/**
 * @param {function} project
 */
export function map(project) {
  /**
   * @param {Observable} source 老的Observable
   */
  return (source) => {
    return new Observable((subscriber) => {
      return source.subscribe({
        ...subscriber,
        // ! 最关键的是要重写next方法
        // 此value是老的Observable传过来的老值
        next: (value) => {
          subscriber.next(project(value));
        },
      });
    });
  };
}
