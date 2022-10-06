/*
 * @Author: water.li
 * @Date: 2022-04-16 20:38:06
 * @Description: 
 * @FilePath: \note\Vue\vue源码\index.js
 */
import {initMixin} from './init'
import {renderMixin} from './render'
import {lifecycleMixin} from './lifecycle'
import {initGlobalAPI} from './global-api'
import {stateMixin} from './state'

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

export default Vue