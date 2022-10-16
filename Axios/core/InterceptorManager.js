/*
 * @Author: water.li
 * @Date: 2022-10-16 21:00:13
 * @Description: 
 * @FilePath: \note\Axios\core\InterceptorManager.js
 */
const utils = require('../utils')

function InterceptorManager() {
  this.handlers = []
}

InterceptorManager.prototype.use = function(fulfilled, rejected, options) {
  this.handlers.push({
    fulfilled,
    rejected,
    synchronous: options ? options.synchronous : false,
    runWhen: options ? options.runWhen : null
  })
  return this.handlers.length - 1
}

InterceptorManager.prototype.inject = function(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null
  }
}

InterceptorManager.prototype.clear = function() {
  if (this.handlers) {
    this.handlers = []
  }
}

InterceptorManager.prototype.forEach = function (fn) {
  utils.forEach(this.handlers, function (h) {
    if (h !== null) {
      fn(h)
    }
  })
}

module.exports = InterceptorManager