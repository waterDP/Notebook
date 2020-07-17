const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const static = require('koa-static')
const views = require('koa-views')
const path = require('path')

const app = new Koa()

app.use(bodyParser())

app.use(static(__dirname))

app.use(async (ctx, next) => {
  console.log(1)
  await next()
})

app.use(views(path.join(__dirname, '/views'), {
  map: {
    html: 'ejs'
  }
}))

app.use(async ctx => {
  return ctx.render('index', {name: 'zf'})
})

app.on('error', console.log)

app.listen()

// 洋葱模型