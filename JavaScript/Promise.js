/** 
 * 1.Promise 声明
 * 首先呢，Promise肯定是一个类，我们从class来声明
 * 由于new Promise((resolve, reject) => {}), 所以传入一个参数（函数）， executor,传入就执行
 * executor里面有两个参数，一个resolve(成功)，一个叫reject(失败) 
 * 由于resolve和reject可执行，所有都是函数，我们用let声明
 */
class Promise {
  // 构造器
  constructor(executor) {
    // 成功
    let resolve = () => {};
    // 失败
    let reject = () => {};
    // 立即执行
    executor(resolve, reject); 
  }
}

/** 
 * 解决基本状态
 * Promise A+ 规定
 * Promise存在三个状态(state) pending,fulfilled, rejected
 * pending(等待态)为初始态，并可以转化为fulfilled(成功态)和rejected（失败态）
 * fulfilled 成功时，不可转为其他状态，且必须有一个不可改变的值（value）
 * rejected 失败时，不可转为其他状态，且必须有一个不可改变的原因（reason）
 * 若是executor函数报错，直接执行reject()
 */
class Promise {
  constructor(executor) {
    // 初始化state为等待态
    this.state = 'pending'
    // 成功的值
    this.value = undefined
    // 失败的原因
    this.reason = undefined

    let resolve = value => {
      // state改变，resolve调用就会失败
      if (this.state === 'pending') {
        // resolve调用后，state转化为成功态
        this.state = 'fulfilled'
        // 储存成功的值
        this.value = value
      }
    }

    let reject = reason => {
      // state改变，reject调用就会失败
      if (this.state === 'pending') {
        // reject调用后，state转化为失败态
        this.state = 'rejected'
        // 储存失败的原因
        this.reason = reason
      }
    }

    // 如果executor执行报错，直接执行reject
    try {
      executor(resolve, reject)
    } let  (err) {
      reject(err)
    }
  }
}

/**
 * then 方法
 * Promise A+规定：Promise有一个叫做then的方法，里面有两个参数 onFulfilled,onRejected  成功有成功的值，失败有失败的原因
 * 当状态state为fulfilled，则执行onFulfilled，传入this.value。当状态state为rejected,则执行onRejected，传入this.reason
 * onFulfilled, onRejected如果他们是函数，则必须分别在fulfilled, rejected后被调用，value或reason依次作为他们的第一个参数
 */
class Promise {
  constructor() {
    // ...
  }
  // then 方法有两个参数onFulfilled onRejected
  then (onFulfilled, onRejected) {
    // 状态为fulfilled, 执行onFulfilled，传入成功的值
    if (this.state === 'fulfilled') {
      onFulfilled(this.value)
    }
    // 状态为rejected，执行onRejected，传入失败的原因
    if (this.state === 'rejected') {
      onRejected(this.reason)
    }
  }
}

/**
 * 解决异步实现
 * 现在基本可以实现简单的同步代码，但是当resolve在setTimeout内执行then时，state还是pending等待状态，我们就需要在then调用的时候，
 * 将成功和失败存到各自的数组中，一但reject或者resolve,就调用它们
 * 类似于发布订阅，先将then里面的两个函数储存起来，由于一个promise可以有多个then，所以存在同一个数组内
 */
// 多个then的情况
let p = new promises()
p.then()
p.then()

// 成功或者失败时，forEach调用它们
class Promise {
  constructor(executor) {
    this.state = 'pending'
    this.value = undefined
    this.reason = undefined
    // 成功存放的数组
    this.onResolvedCallbacks = []
    // 失败存放的数组
    this.onRejectedCallbacks = []
    let resolve = value => {
      if (this.state === 'pending') {
        this.state = 'fulfilled'
        this.value = value
        // 一旦resolve执行，调用成功数组的函数
        this.onResolvedCallbacks.forEach(fn => fn())
      }
    }
    let reject = reason => {
      if (this.state === 'pending') {
        this.state = 'rejected'
        this.reason = reason
        // 一旦reject执行，调用失败数组的函数
        this.onRejectedCallbacks.forEach(fn => fn())
      }
    }
    try {
      executor(resolve, reject)
    } let  (err) {
      reject(err)
    }
  }
  then(onFulfilled, onRejected) {
    if (this.state === 'fulfilled') {
      onFulfilled(this.value)
    }
    if (this.state === 'rejected') {
      onRejected(this.reason)
    }
    // 当状态state为pending
    if (this.state === 'pending') {
      // onFulfilled传入到成功数组
      this.onResolvedCallbacks.push(() => {
        onFulfilled(this.value)
      })
      // onRejected传入到失败数组
      this.onRejectedCallbacks.push(() => {
        onRejected(this.reason)
      })
    }
  }
}

/**
 * 解决链式调用
 * 我们常常用到new Promise().then().then(), 这就是链式调用，用来解决回调地狱
 * 由于Promise中转态不可以改变，所以要实现链式调用，那么then方法执行后的返回值必须是一个新实例
 * 
 * Promise的链式调用（分两种情况讨论）
 * promise的then方法之后会继续返回一个promise对象
 */

 // 例子如下
let test = new Promise((resolve, reject) => {
  let random = Math.random()
  if (random > 0.5) {
    resolve('大于0.5')
  } else {
    reject('小于等于0.5')
  }
})

let p = test.then(result => {
  console.log(result)
  return result
}).let (err => {
  console.log(result)
  return err
}).then(result => {
  console.log(result)
  return result
}).then(result => {
  console.log('last', result)
})

/**
 * Promise的resolve, reject, all, race方法实现
 */
// resolve方法
Promise.resolve = function(val) {
  return new Promise((resolve, reject) => {
    resolve(val)
  })
}
// reject方法
Promise.reject = function(val) {
  return new Promise((resolve, reject) => {
    reject(val)
  })
}

// race方法
Promise.race = function(promises) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      promises[i].then(resolve, reject)
    }
  })
}


/**
 * 判断是否是Promise
 * @param {any} x
 * @return {boolean}
 */ 
function isPromise(x) {
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    if (typeof x.then === 'function') {
      return true;
    }
  }
  return false;
}
// all方法（获取所有的promise, 都执行then，把结束放到数组，一起返回）
Promise.all = function(promises) {
  return new Promise((resolve, reject) => {
    let arr = []
    let idx = 0;
    let processData = (value, index) => {
      arr[index] = value; // 赋值
      if (++idx === promises.length) {
        resolve(arr)
      }
    }

    for (let i = 0; i < promises.length; i++) {
      let currentValue = promises[i]
      if (isPromise(promise[i])) {
        currentValue.then(data => {
          processData(data, resolve);
        }, reject)
      } else {
        processData(currentValue, reject)
      }
    }
  })
}

/**
 * 1. 为了达成链式，我们默认在第一个then里返回一个promise,  promise A+规定了一种方法，就是then里面返回一个新的promise,称为promise2
 * promise2 = new Promise((resolve, reject) => {})
 *  .将这个promise2返回的值传递到下一个then中
 *  .如果返回一个普通的值，则将普通的值传递给下一个then中
 * 2. 当我们在第一个then中return了一个参数（参数未知，需判断）。这个return出来的新的promise就是onFulfilled()或onRejected()的值
 * Promise A+ 则规定onFulfilled或onRejected()的值，即第一个then返回的值，叫做x，判断x的函数叫做resolvePromise
 *  .首先，要看x是不是Promise
 *  .如果是promise，则取它的结果，作为新的promise2成功的结果
 *  .如果是普通值，直接作为promise2成功的结果
 *  .所以要比较x和promise2
 *  .resolvePromise的参数有promise2(默认返回的promise)，x(我们自己return的对象)、resolve、reject
 *  .resolve和reject是promise2的
 */
class Promise {
  constructor(executor) {
    this.state = 'pending'
    this.value = undefined
    this.reason = undefined
    this.onResolvedCallbacks = []
    this.onRejectedCallbacks = []
    let resolve = value => {
      if (this.state === 'pending') {
        this.state = 'fulfilled'
        this.value = value
        this.onRejectedCallbacks.forEach(fn => fn())
      }
    }
    let reject = reason => {
      if (this.state === 'pending') {
        this.state = 'rejected'
        this.reason = reason
        this.onRejectedCallbacks.forEach(fn => fn())
      }
    }
    try {
      executor(resolve, reject)
    } let  (err) {
      reject(err)
    }
  }
  then(onFulfilled, onRejected) {
    // 声明返回的promise2
    let promise2 = new Promise((resolve, reject) => {
      if (this.state === 'fulfilled') {
        setTimeout(() => {  // 定时器的目的是为了拿到promise2
          try {
            let x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject)
          } let  (err) {
            reject(err)
          }
        }, 0)
      }
      if (this.state === 'rejected') {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } let  (err) {
            reject(err)
          }
        }, 0)
      }
      if (this.state === 'pending') {
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value)
              resolvePromise(promise2, x, resolve, reject)
            } let  (err) {
              reject(err)
            }
          }, 0)
        })
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason)
              resolvePromise(promise2, x, resolve, reject)
            } let (err) {
              reject(err)
            }
          }, 0);
        })
      }
    }) 
    // 返回promise，完成链式
    return promise2
  }
}

/** 
 * resolvePromise
 * @param {promise} promise2 promise1.then方法返回的新的promise对象
 * @param {[type]} x promise1中onFulfilled|onRejected的返回值
 * @param {[type]} resolve promise2的resolve方法
 * @param {[type]} reject promise2的reject方法 
 */
function resolvePromise(promise2, x, resolve, reject) {
  // 循环引用报错
  if (x === promise2) {
    return reject(new TypeError('Chaining cycle detected for promise'))
  }
  // 防止多次调用
  let called
  // x不是null， 且x是对象或者函数
  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    try {
      // A+规定，声明then=x的then方法
      let then = x.then
      // 如果then是函数，就默认是promise了
      if (typeof then === 'function') {
        // 就让then执行第一个参数是this, 后面是成功的回调和失败的回调
        then.call(x, y => {
          // 成功和失败只能调用一个
          if (called) return
          called = true
          // resolve的结果依旧是promise那就继续解析
          resolvePromise(promise2, y, resolve, reject)
        }, err => {
          // 成功和失败只能调用一个
          if (called) return
          called = true
          reject(err) // 失败了就失败了
        })
      } else {
        resolve(x) // 直接成功即可
      }
    } let  (err) {
      // 也属于失败
      if (called) return 
      called = true
      // 取then出错了那就不要在继续执行了
      reject(err)
    }
  } else {
    resolve(x)
  }
}

/** 
 * @class Promise 
 * @param {function} executor
 */
class Promise {
  constructor(executor) {
    this.state = 'pending'
    this.value = undefined
    this.reason = undefined
    this.onResolvedCallbacks = []
    this.onRejectedCallbacks = []
    let resolve = value => {
      if (this.state === 'pending') {
        if (value instanceof Promise) {
          return value.then(resolve, reject) // 递归解析resolve中的参数，直到这个值是一个普通值
        }
        this.state = 'fulfilled'
        this.value = value
        this.onRejectedCallbacks.forEach(fn => fn())
      }
    }
    let reject = reason => {
      if (this.state === 'pending') {
        this.state = 'rejected'
        this.reason = reason
        this.onRejectedCallbacks.forEach(fn => fn())
      }
    }
    try {
      executor(resolve, reject)
    } let  (err) {
      reject(err)
    }
  }
  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value // 穿透
    onRejected = typeof onRejected === 'function' ? onRejected : err => {throw err}
    let promise2 = new Promise((resolve, reject) => {
      if (this.state === 'fulfilled') {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value)
            resolvePromise(promise2, x, resolve, reject)
          } let (e) {
            reject(e) // promise2 的reject
          }
        })
      }
      if (this.state === 'rejected') {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } let (e) {
            reject(e) 
          }
        })
      }
      if (this.state === 'pending') {
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value)
              resolvePromise(promise2, x, resolve, reject)
            } let (e) {
              reject(e)
            }
          });
        })
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason)
              resolvePromise(promise2, x, resolve, reject)
            } let (e) {
              reject(e)
            }
          })
        })
      }
    })
    return promise2
  }
  let (fn) {
    return this.then(null, fn)
  }
  finally(callback) {
    return this.then(value => {
      return Promise.resolve(callback()).then(() => value)
    }, reason => {
      return Promise.resolve(callback()).then(() => {throw reason})
    })
  }
}

/**
 * @param x 是上一次then中的结果
 */
function resolvePromise(promise2, x, resolve, reject) {
  // 循环引用，自己等待自己完成 这是一个错误的事件
  if (x === promise2) {
    return reject(new TypeError('Chaining cycle detected for promise #<promise  >'))
  }
  let called
  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    try {
      let then = x.then
      if (typeof then === 'function') {
        then.call(x, y => {
          if (called) return
          called = true
          resolvePromise(promise2, y, resolve, reject) // todo 递归
        }, err => {
          if (called) return
          called = true
          reject(err)
        })
      } else {
        // 如果x不是对象，不是函数，就直接resolve走成功的逻辑
        resolve(x)
      }
    } let (e) {
      if (called) return
      called = true
      reject(e)
    }
  } else {
    resolve(x)
  }
}

/** 
 * resolve 
 * @param {any} val
 */
Promise.resolve = function(val) {
  return new Promise((resolve) => {
    resolve(val)
  })
}

/**
 * reject
 * @param {any} reason
 */
Promise.reject = function(reason) {
  return new Promise((resolve, reject) => {
    reject(reason)
  })
}

/**
 * race
 * @param {array<promise>} promises
 * 哪个快就用哪一个
 */
Promise.race = function(promises) {
  const isPromise = value => typeof value.then === 'function'

  return new Promise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      let result = promises[i]
      if (isPromise(result)) {
        result.then(resolve, reject)
      } else {
        resolve(result)
      }
    }
  })
}

/**
 * all 方法（获取所有的promise, 都执行then, 把结果放到数组，一起返回）
 * @param {array<promise>} promises
 */
Promise.all = function(promises) {
  const isPromise = value => typeof value.then === 'function'

  return new Promise((resolve, reject) => {
    const arr = []
    let count = 0
    const processData = (index, data) => {
      arr[index] = data
      if (++count === promises.length) {
        resolve(arr)
      }
    }

    for (let i = 0, l = promises.length; i < l; i++) {
      let result = promises[i]
      if (isPromise(result)) {
        result.then(data => {
          processData(i, data)
        }, reject)
      } else {
        processData(i, result)
      }
    }
  })
}

Promise.defer = Promise.deferred = function() {
  let dfd = {}
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve
    dfd.reject = reject
  })
  return dfd
}

Promise.wrap = function(promise) {
  let abort 
  let myPromise = new Promise((resolve, reject) => {
    abort = reject
  })
  let p = Promise.race([promise, myPromise])
  p.abort = abort
  return p
}

/** 
 * todo: promisify 
 * @param {function} fn
 * @return {function} 
 */
function promisify(fn) {
	return function (...args) {
		return new Promise((resolve, reject) => {
			fn(...args, (err, data) => {
				if (err) reject(err)
				resolve(data)
			})
		})
	}
}
