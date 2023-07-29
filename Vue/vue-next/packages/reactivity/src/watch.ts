/*
 * @Author: water.li
 * @Date: 2023-03-12 17:31:16
 * @Description:
 * @FilePath: \Notebook\Vue\vue-next\packages\reactivity\src\watch.ts
 */

import { isFunction, isObject } from "@vue/shared";
import { isReactive } from "./reactive";
import { ReactiveEffect } from "./effect";

// 访问一下对象中的属性，触发getter收集依赖
function traverse(value, seen = new Set()) {
  if (!isObject(value)) {
    return value;
  }
  // 如果已经循环了这个对象了，那么再循环会导致死循环
  if (seen.has(value)) {
    return value;
  }
  seen.add(value);
  for (const key in value) {
    traverse(value[key], seen); // ! 触发属性的getter
  }
  return value;
}

export function watch(source, cb, options) {
  return dowatch(source, cb, options);
}

export function watchEffect(effect, options = {}) {
  dowatch(effect, null, options);
}

export function dowatch(source, cb, options) {
  // source 是一个响应式对象 或函数
  let getter;
  if (isReactive(source)) {
    getter = () => traverse(source);
  } else if (isFunction(source)) {
    getter = source;
  }

  let oldValue;

  let clear;
  let onCleanup = (fn) => {
    clear = fn;
  };

  const job = () => {
    if (cb) {
      if (clear) clear();
      const newValue = effect.run();
      cb(newValue, oldValue, onCleanup);
      oldValue = newValue;
    } else {
      effect.run();
    }
  };
  // 如果数据变化了执行对应的scheduler方法
  const effect = new ReactiveEffect(getter, job);
  if (options.immediate) {
    job();
  }
  oldValue = effect.run();
}
