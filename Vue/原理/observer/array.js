const oldArrayMethods = Array.prototype

export const arrayMethods = Object.create(oldArrayMethods)

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
  arrayMethods[method] = function (...args) {
    const result = oldArrayMethods[method].apply(this, args)
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