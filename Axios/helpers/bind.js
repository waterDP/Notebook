/*
 * @Author: water.li
 * @Date: 2022-10-16 19:50:33
 * @Description: 
 * @FilePath: \note\Axios\helpers\bind.js
 */
module.exports = function (fn, thisArg) {
  return function wrap() {
    return fn.apply(thisArg, arguments)
  }
}
