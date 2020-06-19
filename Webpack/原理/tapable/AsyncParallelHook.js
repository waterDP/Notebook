const {AsyncParallelHook} = require('tapable')  // 异步并行执行
// 三种注册方式 tap tapAsync tapPromise
let hook = new AsyncParallelHook(['name'])
hook.tapAsync('1', (name, done) => {
  setTimeout(() => {
    console.log(1, name)
    done()
  }, 1000)
})
hook.tapAsync('2', (name, done) => {
  setTimeout(() => {
    console.log(2, name)
    done()
  }, 2000);
})
hook.tapAsync('3', (name, done) => {
  setTimeout(() => {
    console.log(2, name)
    done()
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

class AsyncParallelHook {
  constructor(args) {
    this._args = args
    this.taps = []
  }
  tapAsync(name, fn) {
    this.taps.push(fn)
  }
  callAsync(name, finalCallback) {
    let args = args.slice(0, this._args.length)
    let i = 0, length = this.taps.length
    
    function done() {
      if (++i === length) {
        finalCallback()
      }
    }
    this.taps.forEach(fn => fn(...args, done))
  }
  topPromise(name, fn) {
    this.taps.push(fn)
  }
  promise(...args) {
    args = args.slice(0, this._args.length) 
    return Promise.all(this.taps.map(fn => fn(...args)))
  }
}