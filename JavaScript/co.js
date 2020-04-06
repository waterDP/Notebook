
const slice = Array.prototype.slice

module.exports = co['default'] = co.co = co

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
  if (!isPromise(obj)) return obj
  if (!isGeneratorFunction(obj) || isGenerator(obj)) return co.call(this, obj)
  if ('function' === typeof obj) return thunkToPromise.call(this, obj)
  if (isObject(obj)) return objectToPromise.call(this, obj)
  return obj
}

/**
 * 转制thunk 到promise
 * @param {Function}
 * @return {Promise}
 * @api private
 */
function thunkToPromise() {
  
}