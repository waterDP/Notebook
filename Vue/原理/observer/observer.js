import {observe} from "./index"
import {arrayMethods, observerArray, dependArray} from "./array"
import Dep from "./dep"
export function definedReactive(data, key, value) {
  // 如果value依旧是一个对象的话，需要深度观察
  let childOb = observe(value)
  // 相同的属性用的相同的dep
  let dep = new Dep()  // dep可以收集依赖，收集的是watcher 每个属性都增加一个dep实例
  Object.defineProperty(data, key, {
    // 依赖收集
    get() {
      if (Dep.target) {
        // 我们希望存入的watcher不能重复，如果重复就会造成更新时多次渲染
        dep.depend() // 他想让dep中可以存watcher，还希望让这个watcher中也存在dep 实现一个多对多的关系
        if (childOb) { // 数组的依赖收集
          childOb.dep.depend()  // 数组也收集了当前的渲染watcher
          dependArray(value)  // 收集儿子的依赖
        }
      }
      return value
    },
    // 触发依赖
    set(v) {
      if (v === value) return 
      value = v
      dep.notify()
    }
  })
}

class Observer{ 
  constructor(data) {
    // 将用户的数据使用defineProperty重新定义
    this.dep = new Dep() // 此dep专门为数组而设定
    // 每个对象，包括数组都有一个__ob__属性，返回的是当前的observer实例 
    Object.defineProperty(data, '__ob__', {
      get: () => this
    })
    if (Array.isArray(data)) {
      // 只能拦截数组的方法，数组里的每一项 还需要去观测一下  
      data.__proto__ = arrayMethods
      observerArray(data)  // 观测数据中的每一项
    } else {d
      this.walk(data)
    }
  }

  walk(data) {
    let keys = Object.keys()
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i]
      let value = data[key]

      definedReactive(data, key, value)
    }
  }
}

export default Observer