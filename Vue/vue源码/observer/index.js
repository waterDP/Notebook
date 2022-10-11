/*
 * @Author: water.li
 * @Date: 2022-04-16 20:38:06
 * @Description: 
 * @FilePath: \note\Vue\vue源码\observer\index.js
 */
import { isObject, def, hasOwn } from '../util/index'
import { newArrayProto } from "./array"
import Dep from './dep'

export let shouldObserve = true

export function toggleObserving (value) {
  shouldObserve = value
}

class Observer {
  constructor(value) {
    this.value = value
    this.dep = new Dep() // 这个是单独给数组用的
    def(value, '__ob__', this) // 给数组用的 这个值不能枚举
    if (Array.isArray(value)) {
      value.__proto__ = newArrayProto
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }
  observeArray(value) {
    for (let i = 0; i < value.length; i++) {
      observe(value[i])
    }
  }
  walk(data) {
    let keys = Object.keys(data)
    keys.forEach(key => {
      defineReactive(data, key, data[key])
    })
  }
}

/**
 * 定义响应式数据
 * @param target
 * @param {string} key
 * @param value
 */
function defineReactive(target, key, value) {
  let dep = new Dep() // 这个dep是给对象用的
  // 这里这个value可能是数组 也可能是对象，返回的结果是observer的实例，当前这个value对应的observer
  let childOb = observe(value) // ! 递归劫持数据
  Object.defineProperty(target, key, {
    enumerable: true,
    configurable: true,
    get() {
      // 每个属性都对应着自己的watcher
      if (Dep.target) {
        dep.depend() // 意味着我要将watcher存起来
        if (childOb) {
          childOb.dep.depend() // 收集了数组的相关依赖
          // 如果数组中还有数组
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set(newValue) {
      if (newValue === value) return

      observe(newValue) // 劫持新的数据 继续劫持用户设置的值
      value = newValue

      dep.notify() // 通知依赖的watcher进行一个更新的操作
    }
  })
}

function dependArray(arr) {
  arr.forEach(item => {
    item.__ob__ && item.__ob__.dep.depend()
    if (Array.isArray(item)) {
      dependArray(item)
    }
  })
}

export function observe(data) {
  if (!isObject(data)) {
    return
  }
  if (data.__ob__ instanceof Observer) {
    return 
  }
  if (!shouldObserve) {
    return
  }
  return new Observer(data)
}

export function set(target, key, val) {
  if (Array.isArray(target)) {
    target.length = Math.max(target.length, key)
    target.splice(key, 1, val)
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val
    return val
  }
  const ob = target.__ob__

  // 以前不是响应式的，以后也不是
  if (!ob) {
    target[key] = val
    return val
  }

  defineReactive(ob.value, key, val)
  ob.dep.notify()
  return val
}

export function del(target, key) {
  if (Array.isArray(target)) {
    target.splice(key, 1)
    return 
  }
  const ob = target.__ob__
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key]
  if (!ob) return
  ob.dep.notify()
}