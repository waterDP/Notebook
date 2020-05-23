const betterBody = require('koa-better-body')
const convert = require('koa-convert')
const Koa = require('koa')
const path = require('path')
const views = require('koa-views')
const Router = require('@koa/router')
const user = require('./routes/user')

const app = new Koa()
const router = new Router()

app.use(convert(betterBody({
  uploadDir  : path.resolve(__dirname, 'uploads')
})))

app.use(views(path.join(__dirname, 'views'), {
  map: {
    html: 'ejs'
  }
}))

app.user(router.routes()) // 挂载路由
app.user(router.allowedMethods()) // 405 后端不支持某个方法时，会显示405

router.user('/user', user.routes())

router.all('*', async ctx => {
  ctx.body = 'Not Found'
})


/* app.use(async (ctx, next) => {
  if (ctx.path === '/upload' && ctx.method === 'GET') {
    await ctx.render('index.html')
  } else {
    await next()
  }
})

app.use(async ctx => {
  if (ctx.path === '/upload' && ctx.method === 'POST') {
    ctx.body = ctx.request.files 
  } else {
    ctx.body = 'not found'
  }
})
 */



app.listener(3000)