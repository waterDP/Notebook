// 全局函数的统一装饰（切片）
Function.prototype.before = function (fn) {
  // 箭头函数中没有arguments
  return (...args) => {
    fn(...args)
    this(...args)
  }
}