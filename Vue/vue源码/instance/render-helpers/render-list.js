/*
 * @Author: water.li
 * @Date: 2022-10-08 21:06:16
 * @Description: 
 * @FilePath: \note\Vue\vue源码\instance\render-helpers\render-list.js
 */

/**
 * <div>
 *   <span v-if="flag" v-for="i in 3"></span>
 * </div>
 * 
 * function render() {
 *   with(this) {
 *     return _c('div', _l(3, function(i) {
 *       return (flag) ? _c('span') : _e() 
 *     }))
 *   }
 * }
 */

export function renderList(val, render) {
  let ret, i, keys, key

  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length)
    for (i = 0; i < val.length; i++) {
      ret[i] = render(val[i], i)
    }
  } else if (typeof val === 'number') {
    ret = new Array(val)
    for (i = 0; i < val; i++) {
      ret[i] = render(i+1, i)
    }
  } else {
    keys = Object.keys(val)
    ret = new Array(keys.length)
    for (i = 0; i < keys.length; i++) {
      key = keys[i]
      ret[i] = render(val[key], key, i)
    }
  }

  return ret

}
