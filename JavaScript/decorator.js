// 类装饰器
function log(target) {
  const desc = Object.getOwnPropertyDescriptors(target.prototype)
  for (const key of Object.keys(desc)) {
    if (key === 'constructor') {
      continue
    }
    const func = desc[key].value
    if ('function' === typeof func) {
      Object.defineProperty(target.prototype, key, {
        value(...args) {
          console.log('before')
          const ret = func.apply(this, args)
          console.log('after')
          return ret
        }
      })
    }
  }
}

// 类属性成员的装饰器
function readonly(target, key, descriptor) {
  descriptor.writable = false
}

// 类方法成员装饰器
function validate(target, key, descriptor) {
  const func = descriptor.value
  // AOP
  descriptor.value = function(...args) {
    for (let num of args) {
      if ('number' !== typeof num) {
        throw new Error(`"${num}" is not a number`)
      }
    }
    return func.apply(this, args)
  }
}

@log
class Numberic {
  @readonly PI = 3.1425

  @validate
  add(...nums) {
    return nums.reduce((p, n) => (p + n), 0)
  }
}