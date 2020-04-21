/**
 * 1.bind方法可以绑定this指向
 * 2.bind方法返回一个绑定后的函数（高阶函数）
 * 3.如果绑定的函数被new了 当前函数的this就是就是当前的实现
 * 4.new 出来的结果可以找到原有类的结果  
 */
Function.prototype.bind = function(context) {
  let that = this;
  let bindArgs = Array.prototype.slice.call(arguments, 1)
  function fBound () {
    let args = Array.prototype.slice.call(arguments, 1)
    that.apply(this instanceof fBound ? this : context, bindArgs.concat(args))
  }
  function Fn() {}
  Fn.prototype = this.prototype
  fBound.prototype = new Fn()
  return fBound
}