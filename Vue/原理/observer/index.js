import {isObject, def} from '../util'
import {arrayMethods} from './array'

class Observer {
  constructor(value) {
    def(value, '__ob__', this)
    if (Array.isArray(value)) {
      this.observerArray(value)
    } else {
      this.walk(value)
    }
  }
  observerArray(value) {
    for (let i = 0; i < value.length; i++) {
      value.__proto__ = arrayMethods
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

function defineReactive(data, key, value) {
  observe(value) // 递归劫持数据
  Object.defineProperty(data, key, {
    get () {
      return value
    },
    set(newValue) {
      if (newValue === value) return
      observe(newValue)
      value = newValue
    }
  })
}

export function observe(data) {
  if (!isObject(data)) {
    return
  }
  return new Observer(data)
}