const {SyncHook} = require('tapable')

const hook = new SyncHook(['name'])

hook.tap({context: 1, name: '1'}, (ctx, name) => {
  console.log(ctx) // {ctx.loop: true}
})

hook.intercept({
  context: true, // 当前正在使用上下文
  loop(ctx) {
    ctx.loop = true
  }
})

hook.call('zhufeng')