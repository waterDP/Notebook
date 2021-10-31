/*
 * @Author: your name
 * @Date: 2021-10-31 20:40:05
 * @LastEditTime: 2021-10-31 21:28:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \notebook\Vue\vue3源码\packages\reactivity\baseHandlers.js
 */

import { isObject } from "../shared"
import { reactive, readonly } from "./reactive"

function createGetter(isReadonly = false, shallow = false) {
  return function get(target, key, receiver) {
    const res = Reflect.get(target, key, receiver)
    if (!isReadonly) {  // 不是只读的
      // 收集依赖
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

// readonly 没有set
export const readonlyHandlers = {
  get: readonlyGet
}
export const shallowReadonlyHandler = {
  get: shallowReadonlyGet
}