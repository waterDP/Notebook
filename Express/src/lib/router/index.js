const url = require('url')
const Route = require('./route')
const Layer = require('./layer')
const methods = require('methods')
function Router() {
  this.stack = [] // 维护用户所有的路由
}
Router.prototype.route = function(path) {
  let route = new Route()
  // 每个路由的layer上，都有一个路径和一个处理函数
  let layer = new Layer(path, route.dispatch.bind(route))
  layer.route = route  
  // 将当前生成的路由层，放到路由系统中
  this.stack.push(layer)
  return route
}
methods.forEach(method => {
  Router.prototype[method] = function(path, handlers) {
    // 当我们调用get方法时，需要创建一个layer将layer放到我们的stack中
    // 路由系统中的layer上应该有一个route属性
    let route = this.route(path) // 每次调用get我都产生一个route
    // 需要将用户的handler传入到路由对象的route的内部
    route[method](handlers)
  }
})

Router.prototype.use = function(path, handler) {
  if (typeof handler !== 'function') {
    handler = path
    path = '/'
  }
  let layer = new Layer(path, handler)
  // layer.route = undefined
  this.stack.push(layer)
}

Router.prototype.handle = function(req, res, out) {
  let {pathname} = url.parse(req.url)
  // 需要让路由自动去自动配置
  // 依次取出每一个来执行
  // 1.先将stack中的第一项拿出来
  let idx = 0
  let next = () => {
    if (idx >= this.stack.length) return out()
    let layer = this.stack[idx++]
    // 如果是中间件，直接路径匹配就可以执行。如果是路由，需要多匹配一个方法
    if (layer.match(pathname)) {
      if (!layer.route) {
        // 中间件
        layer.handle_request(req, res, next)
      } else {
        // 路由
        if (layer.route.handle_method(req.method.toLowerCase())) {
          layer.handle_request(req, res, next)
        } else {
          next()
        }
      }
    } else {
      next()
    }
  } 
  next()
}

module.exports = Router