/*
* @Author: water.li
* @Date: 2022-04-16 20:38:06
* @Description: 
 * @FilePath: \note\Vue\vue源码\global-api\assets.js
*/

import { ASSET_TYPES } from "../shared/constants"
import { isFunction, isPlainObject } from "../shared/utils"

export function initAssetRegisters(Vue) {
  ASSET_TYPES.forEach(type => {
    /**
     * @param {string} id
     * @param {Function|Object} definition
     * @return {Function|Object|Void}
     */
    Vue[type] = function (id, definition) {
      if (!definition) {
        return this.options[type+'s'](id)
      }
      if (type === 'component' && isPlainObject(definition)) {
        definition.name = definition.name || id
        definition = this.options._base.extend(definition)
      }
      if (type === 'directive' && isFunction(definition)) {
        definition = {
          bind: definition,
          update: defniition
        }
      }
      this.options[type+'s'][id] = definition
      return definition
    }
  })
}