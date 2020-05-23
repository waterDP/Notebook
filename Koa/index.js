const Koa = require('./Koa.js')

// 创建app应用
let app = new Koa()

app.use(ctx => {
  console.log(ctx.req.url)
  console.log(ctx.request.url)

  console.log(ctx.request.req.url)
  console.log(ctx.url)

  ctx.body = 'hello'
  ctx.response.body = 'hello'
})

app.listen(3000)