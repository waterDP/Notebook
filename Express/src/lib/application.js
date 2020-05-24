const url = require('url')
const http = require('http')
const Router = require('./router/index')
const methods = require('methods')

function Application() {
  // 维护一个数据用来存放用户的get方法
  // 等会请求到来时，依次查找
  // 每次let = express()执行都应该有一个独立的路由系统

  // 我希望当创建应用的时候，不是立即初始化路由系统
  // this._router = new Router()
}

Application.prototype.lazy_route = function() {
  if (!this._router) {
    this._router = new Router()
  }
}

methods.forEach(method => {
  Application.prototype[method] = function(path, ...handlers) {
    this.lazy_route()
    this._router[method](path, handlers)
  }
})

// 在使用中间件的时候 path可能没有传递, 没有传递就是/
Application.prototype.use = function(path, handler) {
  // 应用层主要是分配逻辑的
  this.lazy_route()
  this._router.use(path, handler)
}

Application.prototype.listener = function(...rest) {
  // 创建一个http服务器
  let server = http.createServer((req, res) => {
    function done() {
      res.end(`Cannot ${req.method} ${req.url}`)
    }
    this.lazy_route()
    this._router.handle(req, res, done)
  })
  server.listen(...rest)
}

module.exports = Application
