/*
 * @Author: water.li
 * @Date: 2022-04-16 20:38:06
 * @Description: 
 * @FilePath: \note\Vue\vue源码\global-api\extend.js
 */
import {mergeOptions} from '../shared/utils'

export function initExtend (Vue) {
  let cid = 0
  Vue.extend = function(extendOptions) {
    const Super = this
    const Sub = function VueComponent(options = {}) {
      this._init(options)
    }
    
    Sub.cid = cid++
    Sub.prototype = Object.create(Super.prototype)
    Sub.prototype.constructor = Sub
    Sub.options = mergeOptions(Super.options, extendOptions)
    Sub.mixin = Super.mixin
    Sub.use = Super.use
    return Sub
  }
}