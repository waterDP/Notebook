const {SyncWaterfallHook} = require('tapable')

let hook = new SyncWaterfallHook(['name', 'age'])

hook.tap('1', (name, age) => {
  console.log(1, name, age)
})
hook.tap('2', (name, age) => {
  console.log(2, name, age)
  return 'result2' // 如果事件函数的返回值不是undefined,这个返回值将会成为下一个监听函数的参数
})
hook.tap('3', (name, age) => {
  console.log(3, name, age)
})

hook.call('zhufeng', 10) // call触发事件，或者说执行