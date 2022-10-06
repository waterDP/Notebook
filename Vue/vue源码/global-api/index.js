/*
 * @Author: water.li
 * @Date: 2022-04-16 20:38:06
 * @Description: 
 * @FilePath: \note\Vue\vue源码\global-api\index.js
 */
import { initUse } from "./use"
import { initMixin } from './mixin'
import { initAssetRegisters } from './assets'
import { ASSETS_TYPE } from './constant'
import { initExtend } from './extend'

export function initGlobalAPI(Vue) {
  // 整合了所有的全局相关的内容
  Vue.options = Object.create(null)


  // 初始化的全局过滤器 指令 组件 
  ASSETS_TYPE.forEach(type => {
    Vue.options[key + 's'] = {}
  })

  Vue.options._base = Vue  // Vue的构造函数

  initUse(Vue)
  initMixin(Vue)
  initExtend(Vue)
  initAssetRegisters(Vue)
}