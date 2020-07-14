const {SyncLoopHook} = require('tapable')

// 它的特点是不停的执行事件函数，直到结果返回undefined
// 特别要注意的是，每次都是从头我开始循环的
let hook = new SyncLoopHook(['name', 'age'])

let count1=0
let count2=0
let count3=0

hook.tap('1', (name, age) => {
  console.log(1, count1, name, age)
  if (++count1 === 1) {
    count1 = 0
    return
  }
  return true
})
hook.tap('2', (name, age) => {
  console.log(2, count2, name, age)
  if (++count2 === 2) {
    count2 = 0
    return
  }
  return true
})
hook.tap('3', (name, age) => {
  console.log(3, count3, name, age)
  if (++count3 === 3) {
    count3 = 0
    return
  }
  return true
})
hook.call('zhufeng', 10)

class SyncLoopHook {
  constructor(args) {
    this._args = args
    this.taps = []
  }
  tap(name, fn) {
    this.taps.push(fn)
  }
  call(...args) {
    args = args.slice(0, this._args.length)
    this.taps.forEach(fn => {
      let result
      do {
        result = fn(...args)
      } while (typeof result !== 'undefined')
    })
  }
}