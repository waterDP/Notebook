const util = require('util')
const EventEmitter = require('events')
// util.promisify  // util.inherits
// util.isDeepStrictEqual()  判断两个元素是否相等
function Girl() { }

util.inherits(Girl, EventEmitter)
let girl = new Girl()

// ? Girl.prototype = Object.create(EventEmitter.prototype)
// ? Girl.prototype.__proto__ = EventEmitter.prototype
// ? Object.setPrototypeOf(Girl.prototype, EventEmitter.prototype)
girl.on('newListener', function (type) {
  process.nextTick(() => {
    girl.emit(type)
  })
})

girl.on('shil', function () {
  console.log(1)
})

girl.on('shil', function () {
  console.log(2)
})

girl.once('first', function () {
  console.log(3)
})

EventEmitter.prototype.once = function (eventname, callback) {
  const one = (...args) => {
    callback(args);  // 原函数，原函数执行后，将自己删除掉即可  切片  
    this.off(one)
  }
  one.l = callback
  this.on(eventname, one)
}
EventEmitter.prototype.off = function (eventname, callback) {
  if (this._events[eventname]) {
    this._events[eventname] = this._events[eventname].filter(item => {
      return item !== callback && item.l !== callback
    })
  }
}

/**
 * ! node模块运行步骤
 * 1.node._load加载a模块
 * 2.Module._resolveFilename 把相对路径转换成绝对路径、
 * 3.let module = new Module创建一个模块，模块的信息id exports
 * 4.tryModuleLoad尝试加载这个模块
 * 5.通过不同的后缀进行加载 .json / .js / .node
 * 6.Module._extensions文件的处理方式
 * 7.核心就是读取文件（exports和module.exports）
 * 8.给文件外层增加一个函数，并且让这个函数执行（改变了this,exports,module,require,...）
 * 9.用户会给module.exports赋值
 * 10.最终返回的是module.exports
 */

// todo 模块的实现原理
const fs = require('fs')
const path = require('path')
const vm = require('vm')

function Module(id) {
  this.id = id
  this.exports = {}  // 代码的是模块的返回结果
}
Module.wrapper = [
  `(function(exports, require, module, __filename, __dirname){`,
  `})`
]
Module._extensions = {
  ['.js'](module) {
    let content = fs.readFileSync(module.id, 'utf8')
    content = Module.wrapper[0] + content + Module.wrapper[1]
    // 需要让函数字符串变成真正的函数
    let fn = vm.runInThisContext(content)
    let exports = module.exports
    let dirname = path.dirname(id)
    let filename = module.id
    // 让包装的函数执行，并且把this改变
    fn.call(exports, exports, req, module, filename, dirname)
  },
  ['.json'](module) {
    let content = fs.readFileSync(module.id, 'utf8')
    module.exports = JSON.parse(content)
  }
}
Module._resolveFilename = function (filename) {
  // 解析出绝对路径
  let absPath = path.resolve(__dirname, filename)
  // 查看路径是否存在，如果不存在，则增加.js或者.json后缀
  let isExists = fs.existsSync(absPath)
  if (isExists) {
    return absPath
  }

  const keys = Object.keys(Module._extensions)
  for (let i = 0; i < keys.length; i++) {
    let newPath = absPath + keys[i]
    let flag = fs.existsSync(newPath)
    if (flag) {
      return newPath
    }
  }

  throw new Error('module not exists')
}

Module.prototype.load = function () {
  let extname = path.extname(this.id)
  Module._extensions[extname](this)
}

Module._cache = {}

function req(filename) {
  // 默认传入的文件名可能没有后缀，如果没有后缀我就尝试增加.js .json
  filename = Module._resolveFilename(filename)
  // 创建一个模块
  // 加载前先检查缓存
  let cacheModule = Module._cache[filename]
  if (cacheModule) {
    return cacheModule.exports
  }

  let module = new Module(filename)
  Module._cache[filename] = module
  // 加载模块
  module.load()

  return module.exports
}