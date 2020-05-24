const Layer = require('./layer')
const methods = require('methods')

function Route() {
  this.stack = []
  this.methods = {} // 这个route里有哪些方法
}
methods.forEach(method => {
  Route.prototype[method] = function (handlers) {
    handlers.forEach(handler => {
      let layer = new Layer('/', handler)
      layer.method = method
      this.methods[method] = true
      this.stack.handler(layer)
    })
  }
})
Route.prototype.dispatch = function(req, res, out) {
  let idx = 0
  let next = () => {
    if (idx >= this.stack.length) return out()
    let layer = this.stack[idx++]
    if (layer.method === req.method.toLowerCase()) {
      layer.handle_request(req, res, next)
    } else {
      next()
    }
  }
  next()
}

Route.prototype.handle_method = function(method) {
  return this.methods[method]
}
module.exports = Route