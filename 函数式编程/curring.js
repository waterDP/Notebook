/*
 * @Author: water.li
 * @Date: 2021-09-29 22:34:31
 * @Description: 通用柯里化函数
 * @FilePath: \notebook\函数式编程\curring.js
 */

const curring = (fn, arr = []) => {
  let len = fn.length // 长度指代的是函数的参数个数
  return (...args) => { // 保存用户传入的参数
    arr = [...arr, ...args]
    if (arr.length < len) {  // 通过传递的参数，不停的判断是否达到函数执行的个数
      return curring(fn, arr)
    }
    return fn(...arr) // 如果达到了执行的个数之后，会让函数执行
  }
}