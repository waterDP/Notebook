const {SyncHook} = require('tapable')

const hook = new SyncHook(['name'])

hook.tap('1', name => {
  console.log(name)
})

hook.tap('2', name => {
  console.log(name)
})

hook.intercept({
  call(name) { // 每次call这前先执行这个

  },
  tap({type, fn, name}) { // 在每次挂载监听的时候触发
    console.log('tap', type, fn, name)
  },
  register({type, fn, name}) {
    return {type, fn, name}
  }
})

hook.call('zhufeng')