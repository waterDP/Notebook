const util = require('util')
const EventEmitter = require('events')
// util.promisify  // util.inherits
// util.isDeepStrictEqual()  判断两个元素是否相等
function Girl() {}

util.inherits(Girl, EventEmitter)
let girl = new Girl()

girl.on('newListener', function (type) {
  process.nextTick(() => {
    girl.emit(type)
  })
})

girl.on('shil', function() {
  console.log(1)
})

girl.on('shil', function() {
  console.log(2)  
})

girl.once('first', function() {
  console.log(3)
})

EventEmitter.prototype.once = function(eventname, callback) {
  const one = (...args) => {
    callback(args);  // 原函数，原函数执行后，将自己删除掉即可  切片  
    this.off(one)
  }
  one.l = callback
  this.on(eventname, one)
}
EventEmitter.prototype.off = function(eventname, callback) {
  if (this._events[eventname]) {
    this._events[eventname] = this._events[eventname].filter(item => {
      return item !== callback && item.l !== callback 
    })
  }
}
