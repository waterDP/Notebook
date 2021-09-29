const pathToRegExp = require('path-to-regexp')

function Layer(path, handler) {
  this.path = path
  this.handler = handler
  // 创建一个正则来使用
  this.regexp = pathToRegExp(path, this.keys = [], true)
}
Layer.prototype.match = function(pathname) {
  if(this.path === pathname) {
    return true
  }
  if (!this.route) {
    // 中间件
    if (this.path = '/') {
      return true  // 只要中间件路径是/的话就需要执行
    }
    return pathname.startsWith(this.path+'/')
  } else {
    // 如果是路由
    let matches = pathname.match(this.regexp)
    if (matches) {
      let values = matches.slice(1)
      // 给layer添加一个params属性
      this.params = values.reduce((memo, current) => {
        memo[this.keys[index].name] = current
        return memo
      }, {})
      return true // 将这个params放到req.params上
    }
  }
  return false
}
Layer.prototype.handle_request = function(req, res, next) {
  return this.handler(req, res, next)
}
module.export = Layer