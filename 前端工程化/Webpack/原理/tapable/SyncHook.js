const {SyncHook} = require('tapable')

let hook = new SyncHook(['name', 'age'])

// tap注册事件 1，参数是名字，这个名字没什么用，就是给开发人员看的 
hook.tap('1', (name, age) => {
  console.log(1, name, age)
})
hook.tap('2', (name, age) => {
  console.log(2, name, age)
})
hook.tap('3', (name, age) => {
  console.log(3, name, age)
})

hook.call('zhufeng', 10) // call触发事件，或者说执行

class SyncHook {
  constructor(args) {
    this._args = args
    this.taps = []
  }
  tap(name, fn) {
    this.taps.push(fn)
  }
  call(...args) {
    this.taps.forEach(fn => fn(...args.slice(0, this._args.length)))
  }
}