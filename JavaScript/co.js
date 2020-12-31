const slice = Array.prototype.slice

module.exports = co['default'] = co.co = co

// todo 简单版本
function easyCO(generator) {
  let it = generator()
  function next(arg) {
    let result = it.next()
    result.done || next(result.value)
  }
  next()
}

/**
 * @param {Function} gen 
 * @return {promise}
 * @api public
 */
function co(gen) {
  let args = slice.call(arguments, 1)
  let ctx = this

  return new Promise((resolve, reject) => {
    if (typeof gen === 'function') gen = gen(args)
    if (!gen || typeof gen.next !== 'function') return resolve(gen)

    onFulfilled()

    /**
     * @param {Mixed} res
     * @return {Promise}
     * @api private
     */
    function onFulfilled(res) {
      let ret
      try {
        ret = gen.next(res)
      } catch (e) {
        return reject(e)
      }
      next(ret)
      return null
    }

    /** 
     * @param {Error} err
     * @return {Promise}
     * @api private
     */
    function onRejected(err) {
      let ret
      try {
        ret = gen.throw(err)
      } catch (e) {
        return reject(e)
      }
      next(ret)
    }

    /**
     * @param {Object} ret
     * @return {Promise}
     * @api private
     */
    function next(ret) {
      if (ret.done) return resolve(ret.value)
      let value = toPromise.call(ctx, ret.value)
      if (value && isPromise(value)) return value.then(onFulfilled, onRejected)
      return onRejected(new TypeError(`
        You may only yield a function, promise, generator, array, or object,
        but the following object was passed:
        "${String(ret.value)}"
      `))
    }

  })  
}

/**
 * @param {Mixed} obj 
 * @return {Promise}
 * @api private
 */
function toPromise(obj) {
  if (!obj) return obj
  if (isPromise(obj)) return obj
  if (isGeneratorFunction(obj) || isGenerator(obj)) return co.call(this, obj)
  if ('function' === typeof obj) return thunkToPromise.call(this, obj)
  if (Array.isArray(obj)) return arrayToPromise(obj)
  if (isObject(obj)) return objectToPromise.call(this, obj)
  return obj
}

/**
 * 转制thunk 到promise
 * @param {Function}
 * @return {Promise}
 * @api private
 */
function thunkToPromise(fn) {
  return new Promise((resolve, reject) => {
    fn.call(this, (err, res) => {
      if (err) return reject(err)
      if (arguments.length > 2) res = slice.call(arguments, 1)
      resolve(res)
    })
  })
}

/**
 * @param {Array} obj
 * @return {Promise}
 * @api private
 */
function arrayToPromise(obj) {
  return  Promise.all(obj.map(toPromise, this))
}

/** 
 * @param {Object} obj 
 * @return {Promise}
 * @api private
 */
function objectToPromise(obj) {
  const results = new obj.constructor()
  const keys = Object.keys(obj)
  const promises = []
  for (let i = 0; i < keys.length; i++) {
    let key = keys(obj)
    let promise = toPromise.call(this, obj[key])
    if (promise && isPromise(promise)) defer(promise, key)
    else results[key] = obj[key]
  }
  return Promise.all(promises).then(() => results)

  function defer(promise, key) {
    // predefine the key in the result
    results[key] = undefined
    promises.push(promise.then(res => results[key] = res))
  }
}

/**
 * @param {Object} obj
 * @return {boolean}
 * @api private
 */
function isPromise(obj) {
  return 'function' === typeof obj.then
}

/**
 * @param {Mixed} obj
 * @return {Boolean}
 * @api private
 */
function isGenerator(obj) {
  return 'function' === typeof obj.next && 'function' === typeof obj.throw
}

/** 
 * @param {Mixed} obj 
 * @return {Boolean}
 * @api private
 */
function isGeneratorFunction(obj) {
  const constructor = obj.constructor
  if (!constructor) return false
  if ('GeneratorFunction' === constructor.name || 'GeneratorFunction' === constructor.displayName) return true
  return isGenerator(constructor.prototype)
}

/**
 * @param {Mixed} val 
 * @return {Boolean}
 * @api private
 */ 
function isObject(val) {
  return Object === val.constructor
}