/*
 * @Author: water.li
 * @Date: 2022-10-16 20:25:59
 * @Description: 
 * @FilePath: \note\Axios\utils.js
 */

const bind = require("./helpers/bind")

function forEach(obj, fn) {
  if (obj === null || typeof obj === 'undefind') {
    return
  }

  if (Array.isArray(obj)) {
    // 循环数组
    for (let i = 0; i < obj.length; i++) {
      fn(obj[i], i, obj)
    }
  } else {
    // 循环对象
    for (let key in obj) {
      fn(obj[key], key, obj)
    }
  }
}

function extend(a, b, thisArg) {
  forEach(b, (val, key) => {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg)
    } else {
      a[key] = val
    }
  })
  return a
}

module.exports = {
  bind,
  extend
}