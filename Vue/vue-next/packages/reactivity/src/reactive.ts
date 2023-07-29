/*
 * @Author: water.li
 * @Date: 2022-04-08 21:36:15
 * @Description:
 * @FilePath: \Notebook\Vue\vue-next\packages\reactivity\src\reactive.ts
 */

import { isObject } from "@vue/shared";
import { mutableHandlers } from "./handler";

export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
}

const reactiveMap = new WeakMap(); // 缓存已代理的对象，防止重复代理

function createReactiveObject(target: object, isReadonly: boolean) {
  // 先默认认为这个target已经是代理过的属性了
  if (target[ReactiveFlags.IS_REACTIVE]) {
    return target;
  }

  if (!isObject(target)) {
    return target;
  }

  const existingProxy = reactiveMap.get(target);
  if (existingProxy) {
    // 如果已经代理了，就直接从缓存中返回
    return existingProxy;
  }

  const proxy = new Proxy(target, mutableHandlers); // ! 代理
  reactiveMap.set(target, proxy); // 将原对象和生成的代理对象，做一个映射表 防止重复代理
  return proxy;
}

export function isReactive(value) {
  return value && value[ReactiveFlags.IS_REACTIVE];
}

export function reactive(target: object) {
  return createReactiveObject(target, false);
}

export function toReactive(value) {
  return isObject(value) ? reactive(value) : value;
}

export function readonly(target: object) {
  // ...
}

export function shallowReactive(target: object) {
  // ...
}

export function shallowReadonly(target: object) {
  // ...
}
