function EventEmitter {
  this.events  = {}
}

EventEmitter.prototype.on = function(eventName, callback) {
  if (!this._events) {
    this._events = Object.create(null)
  }

  if (eventName !== 'newListener') {
    // 如果当前绑定的不是newListener,看一下用户是否绑定过newListener,如果绑定过就拿出来依次执行
    if (this._events['newListener']) {
      this._events['newListener'].forEach(fn => fn(eventName))
    }
  }

  if (this._events[eventName]) {
    this.events[eventName].push(callback)
  } else {
    this.events[eventName] = [callback]
  }
}

EventEmitter.prototype.emit = function(eventName, ...args) {
  if (this._events[eventName]) {
    this._events[eventName].forEach(fn => {
      fn(...args)
    })
  }
}

// 删除监听的方法
EventEmitter.prototype.off = function(eventName, callback) {
  if (this._events && this._events[eventName]) {
    this._events[eventName] = 
      this._events[eventName].filter(fn => {
        return fn !== callback && fn.l !== callback 
      })
  }
}

EventEmitter.prototype.once = function(eventName, callback) {
  let one = (...args) => {
    callback(...args)
    this.off(eventName, one)
  }
  one.l = callback
  // 切片编程，绑定one函数，在one函数中执行原有逻辑，并且执行完成后再移除事件  
  this.on(eventName, one)
}

module.exports = EventEmitter