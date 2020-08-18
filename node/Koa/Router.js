class Router {
  constructor() {
    this._routes = []
  }
  get(url, handler) {
    this._routes.push({
      url,
      method: 'GET',
      handler
    })
  }
  routes() { // 返回路由处理中间件给Koa使用
    return async (ctx, next) => {
      const {method, url} = ctx
      const matchedRouter = this._routes.find(r => r.method === method && r.url === url)
      if (matchedRouter && matchedRouter.handler) {
        await matchedRouter.handler(ctx, next)
      } else {
        await next()
      }
    }
  }
}