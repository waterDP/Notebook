/** 
 * todo 传值调用：即在进入函数体之前就计算 x+5的值  f(x+5) = f(6)
 * todo 传名调用：即直接将表达式x+5传入函数体，只有用到时它的时候求值  
 */


// ! 在js中，Thunk函数替换的不是表达式，而是多参数函数，将其规制成单参数的版本，且只接受回调函数作为参数

// 正常版本的readFile(多参数版本)
fs.readFile(filename, callback)


// Thunk版本的readFile(单参数版本)
let readFileThunk = Thunk(filename)
readFileThunk(callback)

let Thunk = function(filename) {
  return function(callback) {
    return fs.readFile(filename, callback)
  }
}

/* 
  上面代码中，fs模块的readFile方法是一个多参数函数，两个参数分别为文件和回调函数。经过转换器处理，它变成了一个单参数函数。
  只接受回调函数作为参数。这个单参数版本，就叫做Thunk函数
*/
// 任何函数，只要参数有回调函数，就能写成Thunk函数的形式
const Thunk = function(fn) {
  return function() {
    let args = Array.prototype.slice.call(arguments)
    return function(callback) {
      args.push(callback)
      return fn.apply(this, args)
    }
  }
}

// 使用上面的转换器，生成fs.readFile的Thunk函数
let readFileThunk = Thunk(fs.readFile)
readFileThunk(fileA)(callback)


// todo: thunkify
function thunkify(fn) {
  return function() {
    let args = Array.prototype.slice(arguments)
    let ctx = this
    return function(done) {  // done就是回调
      let called
      args.push(function() {  // AOP
        if (called) return
        called = true
        done.apply(null, arguments)
      })

      try {
        fn.apply(ctx, args)
      } catch(err) {
        done(err)
      }
    }
  }
}


// todo Generator函数的流程管理 
/* thunk函数现在可以用于Generator函数的自动流程管理 */
const fs = require('fs')
const thunkify = require('thunkify')
const readFile = thunkify(fs.readFile)

let gen = function *() {
  let r1 = yield readFile('./etc/fstab')
  console.log(r1.toString())
  let r2 = yield readFile('./etc/shells')
  console.log(r2.toString())
}

let g = gen()
let r1 = g.next()
r1.value(function(err, data) {
  if (err) throw err
  let r2 = g.next(data)
  r2.value(function(err, data) {
    if (err) throw err
    g.next(data)
  })
})
/* 
  仔细查看上面的代码，可以发现generator函数的执行过程，其实是将同一个函数，反复传入next方法的value属性。
  这使得我们可以自动完成这一过程
 */
function run(fn) {
  let gen = fn()

  function next(err, data) {
    let result = gen.next(data)
    if (result.done) return
    result.value(next)
  }

  next()
}

run(gen)