function Layer(path, handler) {
  this.path = path
  this.handler = handler
}
Layer.prototype.match = function(pathname) {
  if(this.path === pathname) {
    return true
  }
  if (!this.route) {
    // 中间件
    if (this.path = '/') {
      return true
    }

    return pathname.startsWith(this.path+'/')
  }
  return false
}
Layer.prototype.handle_request = function(req, res, next) {
  return this.handler(req, res, next)
}
module.export = Layer