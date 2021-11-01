/*
 * @Author: your name
 * @Date: 2021-10-31 20:40:05
 * @LastEditTime: 2021-11-01 10:41:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \notebook\Vue\vue3源码\packages\reactivity\baseHandlers.js
 */

import { extend, isObject } from "../shared"
import { track } from "./effect"
import { TrackOpTypes } from "./operations"
import { reactive, readonly } from "./reactive"

function createGetter(isReadonly = false, shallow = false) {
  return function get(target, key, receiver) {
    const res = Reflect.get(target, key, receiver)
    if (!isReadonly) {  // 不是只读的
      // 收集依赖  收集effect
      track(target, TrackOpTypes.GET, key)
    }
    if (shallow) {  // 浅的
      return res
    }
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res)
    }
    return res
  }
}

const get = createGetter()
const shallowGet = createGetter(false, true)
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)


function createSetter(shallow = false) {
  return function set(target, key, value, receivers) {
    const result = Reflect.set(target, key, value, receivers)

    return result
  }
}
const set = createSetter()
const shallowSet = createSetter(true)

export const reactiveHandlers = {
  get,
  set,
}
export const shallowReactiveHandlers = {
  get: shallowGet,
  set: shallowSet
}

let readonlyObj = {
  set(target, key) {
    console.warn(`set ${target} on key ${key} field`)
  }
}

// readonly 没有set
export const readonlyHandlers = extend({
  get: readonlyGet
}, readonlyObj)
export const shallowReadonlyHandler = extend({
  get: shallowReadonlyGet
}, readonlyObj)