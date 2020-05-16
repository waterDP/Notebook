const {AsyncParallelHook} = require('tapable')  // 异步并行执行
// 三种注册方式 tap tapAsync tapPromise
let hook = new AsyncParallelHook(['name'])
hook.tapAsync('1', (name, callback) => {
  setTimeout(() => {
    console.log(1, name)
    callback()
  }, 1000)
})
hook.tapAsync('2', (name, callback) => {
  setTimeout(() => {
    console.log(2, name)
    callback()
  }, 2000);
})
hook.tapAsync('3', (name, callback) => {
  setTimeout(() => {
    console.log(2, name)
    callback()
  }, 3000);
})

hook.tapPromise('4', name => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log(2, name)
      resolve()
    }, 5000);
  })
})

console.time('cost')
hook.callAsync('zhufeng', () => {
  console.log('over')
  console.timeEnd('cost')
})