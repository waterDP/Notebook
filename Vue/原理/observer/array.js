/** 
 * 主要要做的事就是拦截用户调用的push shift unshift pop reverse sort splice 
 */

import {observe} from "./index"
// 先获取老的数组方法
let arrayProto = Array.prototype

// 拷贝的一个新的对象，可以查找到老的方法
export let arrayMethods = Object.create(arrayProto)

let methods = [
  'push',
  'pop',
  'shift',
  'unshift',
  'sort',
  'reverse',
  'splice'
]

export function observerArray(inserted) {
  // 要循环数组，对数组中的每一项进行观测
  for(let i = 0; i < inserted.length; i++) {
    observe(inserted[i])
  }
}

export function dependArray(value) { // 递归收集数组的依赖
  for (let i = 0; i < value.length; i++) {
    let currentItem = value[i]  // 有可能也是一个数组   需要递归
    currentItem.__ob__ && currentItem.__ob__.dep.depend()
    if (Array.isArray(currentItem)) {
      dependArray(currentItem)  // 不停的收集数组中的依赖关系
    }
  }
}

methods.forEach(method => {
  arrayMethods[method] = function(...args) { // 函数支持  切片编程
    const result = arrayProto[method].apply(this, args)
    let inserted
    switch(method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
      default:
        break 
    }

    if (inserted) observerArray(inserted)
    return result;
    
  }
})