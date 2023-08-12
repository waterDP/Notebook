/*
 * @Author: water.li
 * @Date: 2023-03-12 15:36:32
 * @Description:
 * @FilePath: \Notebook\Vue\vue-next\packages\reactivity\src\handler.ts
 */
import { track, trigger } from "./effect";
import { ReactiveFlags, reactive } from "./reactive";
import { isObject } from "@vue/shared";
import { isRef } from "./ref";

export const mutableHandlers: ProxyHandler<Record<any, any>> = {
  get(target, key, receiver) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true;
    }

    if (isRef((<any>target)[key])) {
      return (<any>target)[key].vaue;
    }

    if ((<any>target)[key]) {
      // ! 懒代理
      // ~ 如果在当前取值发现在取出来的值是对象，那么再进行代理 返回代理后的结果
      return reactive((<any>target)[key]);
    }
    // ^ 这里取值了，可以收集他在哪个effect中
    track(target, key);
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    let oldValue = (<any>target)[key];
    if (oldValue !== value) {
      // ^ 如果改变值了，可以在这里触发effect更新
      trigger(target, key, value, oldValue); // 找属性对应的effect，让他重新执行
    }
    return Reflect.set(target, key, value, receiver);
  },
};
