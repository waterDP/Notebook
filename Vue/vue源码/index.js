/*
 * @Author: water.li
 * @Date: 2022-04-16 20:38:06
 * @Description: 
 * @FilePath: \note\Vue\vue源码\index.js
 */
import { initGlobalAPI } from './global-api'

import { initMixin } from './instance/init'
import { renderMixin } from './instance/render'
import { lifecycleMixin } from './instance/lifecycle'
import { stateMixin } from './instance/state'
import { eventMixin } from './instance/events'

// 初始化全局api
initGlobalAPI(Vue)

function Vue(options) {
  // 进行初始化的
  this._init(options)
}

initMixin(Vue)
renderMixin(Vue)
lifecycleMixin(Vue)
stateMixin(Vue)
eventMixin(Vue)

export default Vue