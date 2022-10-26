/*
 * @Author: water.li
 * @Date: 2022-10-06 13:04:09
 * @Description: 
 * @FilePath: \note\Vue\vue源码\global-api\use.js
 */

import { isFunction, toArray } from "../shared/utils"

export function initUse(Vue) {
  Vue.use = function(plugin) {
    const installedPlugins = this._installedPlugins || (this._installedPlugins = [])
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    const args = toArray(arguments, 1)
    args.unshift(this)
    if (isFunction(plugin.install)) {
      plugin.install.apply(plugin, args)
    } else if (isFunction(plugin)) {
      plugin.apply(null, args)
    }
    installedPlugins.push(plugin)
    return this
  }
}