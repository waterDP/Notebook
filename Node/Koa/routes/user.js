const Router = require('@Koa/router')

const router = new Router({
  prefix: 'user'
})

router.get('/upload', async ctx => {
  await ctx.render('index.html')
})

router.post('/upload', async ctx => {
  ctx.body = ctx.request.files
})

module.exports = router