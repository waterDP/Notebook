/*
 * @Author: water.li
 * @Date: 2022-10-16 20:18:39
 * @Description: 
 * @FilePath: \note\Axios\core\Axios.js
 */

const { validators, assertOptions } = require("../helpers/validator")
const InterceptorManager = require("./InterceptorManager")
const dispatchRequest = require('./dispatchRequest')
const mergeConfig = require("./mergeConfig")
const buildFullPath = require("./buildFullPath")
const buildURL = require("../helpers/buildURL")


function Axios(instanceConfig) {
  this.defaults = instanceConfig
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  }
}

Axios.prototype.request = function (configOrlUrl, config) {
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof configOrlUrl === 'string') {
    config = config || {}
    config.url = configOrlUrl
  } else {
    config = configOrlUrl
  }

  config = mergeConfig(this.defaults, config)

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase()
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase()
  } else {
    config.method = 'get'
  }

  let transitional = config.transitional

  if (transitional !== undefined) {
    assertOptions(transitional, {
      slientJSONPasing: validators.transitional(validators.boolean),
      forcedJSONPasing: validators.transitional(validators.boolean),
      clarifyTimeoutError: validators.transitional(validators.boolean)
    }, false)
  }

  let requestInterceptorChain = []
  let synchronousRequestIntercepters = true
  this.interceptors.request.forEach(function (interceptor) {
    if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
      return
    }
    synchronousRequestIntercepters = synchronousRequestIntercepters && interceptor.synchronous
    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected)
  })

  let responseInterceptorChain = []
  this.interceptors.response.forEach(function (interceptor) {
    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected)
  })

  let promise
  // ? 异步
  if (!synchronousRequestIntercepters) {
    let chain = [dispatchRequest, undefined]

    Array.prototype.unshift.apply(chain, requestInterceptorChain)
    chain = chain.concat(responseInterceptorChain)

    promise = Promise.resolve(config)
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift())
    }
    return promise
  }

  // ? 同步
  let newConfig = config
  while (requestInterceptorChain.length) {
    let onFulfilled = requestInterceptorChain.shift()
    let onRejected = requestInterceptorChain.shift()
    try {
      newConfig = onFulfilled(newConfig)
    } catch (err) {
      onRejected(err)
      break
    }
  }

  try {
    promise = dispatchRequest(newConfig)
  } catch (err) {
    return Promise.reject(err)
  }

  while (responseInterceptorChain.length) {
    promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift())
  }

  return promise
}

Axios.prototype.getUri = function (config) {
  config = mergeConfig(this.defaults, config)
  const fullPath = buildFullPath(config.baseURL, config.url)
  return buildURL(fullPath, config.params, config.paramsSerializer)
}

utils.forEach(['delete', 'get', 'head', 'options'], (method) => {
  Axios.prototype[method] = (url, config) => {
    return this.request(mergeConfig(config || {}), {
      method,
      url,
      data: (config || {}).data
    })
  }
})

utils.forEach(['post', 'put', 'patch'], (method) => {

  function generateHTTPMethod(isForm) {
    return function (url, data, config) {
      return this.request(mergeConfig(config || {}), {
        method,
        headers: isForm
          ? { 'Content-Type': 'multipart/form-data' }
          : {},
        url,
        data
      })
    }
  }

  Axios.prototype[method] = generateHTTPMethod()
  Axios.prototype[method + 'Form'] = generateHTTPMethod(true)
})

module.exports = Axios