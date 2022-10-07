/*
 * @Author: water.li
 * @Date: 2022-04-16 20:38:06
 * @Description: 
 * @FilePath: \note\Vue\vue源码\global-api\extend.js
 */
import {mergeOptions} from '../util/index'

export function initExtend (Vue) {
  let cid = 0
  Vue.extend = function(extendOptions) {
    const Sub = function VueComponent(options = {}) {
      this._init(options)
    }
    Sub.cid = cid++
    Sub.prototype = Object.create(Vue.prototype)
    Sub.prototype.constructor = Sub
    Sub.options = mergeOptions(this.options, extendOptions)
    Sub.mixin = this.mixin
    Sub.use = this.use
    return Sub
  }
}