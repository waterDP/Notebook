/*
 * @Author: your name
 * @Date: 2021-10-31 20:11:47
 * @LastEditTime: 2021-10-31 20:42:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \notebook\Vue\vue3源码\packages\reactivity\reactive.js
 */

import { isObject } from "../shared"
import {
  reactiveHandlers,
  shallowReactiveHandlers,
  readonlyHandlers,
  shallowReadonlyHandler
} from "./baseHandlers"

export function reactive(target) {
  return createReactiveObj(target, false, reactiveHandlers)
}

export function shallowReactive(target) {
  return createReactiveObj(target, false, shallowReactiveHandlers)
}

export function readonly(target) {
  return createReactiveObj(target, true, readonlyHandlers)
}

export function shallowReadonly(target) {
  return createReactiveObj(target, true, shallowReadonlyHandler)
}

const reactiveMap = new WeakMap()
const readonlyMap = new WeakMap()

function createReactiveObj(target, isReadonly, baseHandler ) {
  if (!isObject(target)) {
    return target
  }
  
  const proxyMap = isReadonly ? readonlyMap : reactiveMap
  const proxyEx = proxyMap.get(target)
  if (proxyEx) {
    return proxyEx
  }
  
  // 核心
  const proxy = new Proxy(target, baseHandler)
  proxyMap.set(target, proxy)

  return proxy
}