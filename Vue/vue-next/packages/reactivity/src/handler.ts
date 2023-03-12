/*
 * @Author: water.li
 * @Date: 2023-03-12 15:36:32
 * @Description:
 * @FilePath: \Notebook\Vue\vue-next\packages\reactivity\src\handler.ts
 */
import { track, trigger } from "./effect";
import { ReactiveFlags } from "./reactive";

export const mutableHandlers: ProxyHandler<Record<any, any>> = {
  get(target, key, receiver) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true;
    }
    // ^ 这里取值了，可以收集他在哪个effect中
    track(target, key);
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    let oldValue = (<any>target)[key];
    let result = Reflect.set(target, key, value, receiver);
    if (oldValue !== value) {
      // ^ 如果改变值了，可以在这里触发effect更新
      trigger(target, key); // 找属性对应的effect，让他重新执行
    }
    return result;
  },
};
