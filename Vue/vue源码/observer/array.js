/*
 * @Author: water.li
 * @Date: 2022-04-16 20:38:06
 * @Description: 
 * @FilePath: \note\Vue\vue源码\observer\array.js
 */
const oldArrayProto = Array.prototype

export const newArrayProto = Object.create(oldArrayProto)

const methods = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

methods.forEach(method => {
  newArrayProto[method] = function (...args) {
    const result = oldArrayProto[method].apply(this, args)
    const ob = this.__ob__
    let inserted // 当前用户插入的元素
    switch(method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) ob.observerArray(inserted) // 监听用户当前添加的元素
    ob.dep.notify()
    return result
  }
})