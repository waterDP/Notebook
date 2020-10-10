/** 
 * 类装饰器
 * @param constructor 类的构造函数 
 */
function log(constructor) {
  const desc = Object.getOwnPropertyDescriptors(constructor.prototype)
  for (const key of Object.keys(desc)) {
    if (key === 'constructor') {
      continue
    }
    const func = desc[key].value
    if ('function' === typeof func) {
      Object.defineProperty(constructor.prototype, key, {
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

function Greeter(greeting) {
  return function(target) {
    target.prototype.greet = function() {
      console.log(greeting)
    }
  }
}

@Greeter('Hello World')
class Greeting {}

let myGreeting = new Greeter()
myGreeting.greet()

/**
 * 属性装饰器
 * @param target 对于静态成员来说是类的构造函数，对于实例成员来说是类的原型对象
 * @param property 属性的名称
 * @param descriptor 属性描述符
 */
function readonly(target, property, descriptor) {
  descriptor.writable = false
}

/**
 * 方法装饰器
 * @param target 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象
 * @param property 方法的名称
 * @param descriptor 方法描述符
 */
function validate(target, property, descriptor) {
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

/**
 * 装饰器的执行顺序
 * 1.类装饰器是最后执行的，后写的类装饰器先执行
 * 2.方法和方法参数中的装饰器先执行方法参数装饰器
 * 3.方法和属性装饰器，谁在前面先执行谁
 * 一般是先内后外
 */