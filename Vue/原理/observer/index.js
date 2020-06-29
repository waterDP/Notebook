import {isObject, def} from '../util/index'
import {arrayMethods} from './array'
import Dep from './dep'

class Observer {
  constructor(value) {
    this.dep = new Dep() // 这个是单独给数组用的
    def(value, '__ob__', this) // 给数组用的 这个值不能枚举
    if (Array.isArray(value)) {
      value.__proto__ = arrayMethods
      this.observerArray(value)
    } else {
      this.walk(value)
    }
  }
  observerArray(value) {
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
 * @param data
 * @param {string} key
 * @param value
 */
function defineReactive(data, key, value) {
  let dep = new Dep() // 这个dep是给对象用的
  // 这里这个value可能是数组 也可能是对象，返回的结果是observer的实例，当前这个value对应的observer
  let childOb = observe(value) // ! 递归劫持数据
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get () {
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
  return new Observer(data)
}