/*
 * @Author: water.li
 * @Date: 2022-04-08 21:36:15
 * @Description: 
 * @FilePath: \notebook\Vue\vue-next\packages\reactivity\src\reactive.ts
 */

import { isObject } from "@vue/shared"
import { track, trigger } from "./effect"

const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive'
}

const mutableHandlers: ProxyHandler<Record<any, any>> = {
  get(target, key, recevier) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true
    }
    track(target, key)
    const  res = Reflect.get(target, key, recevier)

    // 这里取值了，可以收集他在哪个effect中
    return res
  },
  set(target, key, value, recevier) {
    let oldValue = (<any>target)[key]
    const res = Reflect.set(target, key, value, recevier)

    if (oldValue !== value ) {
      trigger(target, key) // 找属性对应的effect，让他重新执行
    }
    // 如果改变值了，可以在这里触发effect更新
    return res
  }
}

const reactiveMap = new WeakMap()

function createReactiveObject(target: object, isReadonly: boolean) {

  // 先默认认为这个target已经是代理过的属性了
  if ((<any>target)[ReactiveFlags.IS_REACTIVE]) {
    return target
  }

  if (!isObject(target)) {
    return target 
  }

  const exisitingProxy = reactiveMap.get(target)
  if (exisitingProxy) {
    // 如果已经代理了，就直接从缓存中返回
    return exisitingProxy
  }

  const proxy = new Proxy(target, mutableHandlers)
  reactiveMap.set(target, proxy) // 将原对象和生成的代理对象，做一个映射表 防止重复代理
  return proxy
}

export function reactive(target: object) {
  return createReactiveObject(target, false)
}

export function toReactive(value) { 
  return isObject(value) ? reactive(value) : value
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