/*
 * @Description: Promise
 * @Date: 2021-12-28 22:24:22
 * @Author: water.li
 * 
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
    } catch  (err) {
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
          } catch (err) {
            reject(err)
          }
        }, 0)
      }
      if (this.state === 'rejected') {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch  (err) {
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
            } catch  (err) {
              reject(err)
            }
          }, 0)
        })
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason)
              resolvePromise(promise2, x, resolve, reject)
            } catch (err) {
              reject(err)
            }
          }, 0)
        })
      }
    }) 

    return promise2
  }
  catch(errCallback) {
    return this.then(null, errCallback)
  }
  finally(callback) {
    return this.then(val => {
      return Promise.resolve(callback()).then(() => val)
    }, err => {
      return Promise.resolve(callback()).then(() => {throw err})
    })
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
    } catch(err) {
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
Promise.promisify = function(fn) {
	return function (...args) {
		return new Promise((resolve, reject) => {
			fn(...args, (err, data) => {
				if (err) reject(err)
				resolve(data)
			})
		})
	}
}