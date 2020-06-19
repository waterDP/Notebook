const {SyncBailHook} = require('tapable')

let hook = new SyncBailHook(['name', 'age'])

// tap注册事件 1，参数是名字，这个名字没什么用，就是给开发人员看的 
hook.tap('1', (name, age) => {
  console.log(1, name, age)
})
hook.tap('2', (name, age) => {
  console.log(2, name, age)
  return 2 // 一旦发现有一个事件函数返回了不为undefined的返回值，则不再执行后面的事件函数
})
hook.tap('3', (name, age) => {
  console.log(3, name, age)
})

hook.call('zhufeng', 10) // call触发事件，或者说执行

class SyncBailHook {
  constructor(args) {
    this._args = args
    this.taps = []
  }
  tap(name, fn) {
    this.taps.push(fn)
  }
  call(...args) {
    const length = this.taps.length
    args = args.slice(0, this._args.length)
    for (let i = 0; i < length; i++) {
      let result = this.taps[i](...args)
      if ('undefined' !== typeof result) return
    }
  }
}