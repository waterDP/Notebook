/*
 * @Author: water.li
 * @Date: 2020-03-29 22:53:27
 * @Description: 
 * @FilePath: \notebook\JavaScript\instanceof.js
 */
function _instanceof(obj, Con) {
  Con = Con.prototype
  obj = obj.__proto__
  while (true) {
    if (obj === null) return false
    if (obj === Con) return true
    obj = obj.__proto__
  }
}
