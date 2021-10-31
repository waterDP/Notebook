import { initMixin } from './mixin'
import { initAssetRegisters } from './assets'
import { ASSETS_TYPE } from './constant'
import { initExtend } from './extend'

export function initGlobalAPI(Vue) {
  // 整合了所有的全局相关的内容
  Vue.options = Object.create(null)

  initMixin(Vue)

  // 初始化的全局过滤器 指令 组件 
  ASSETS_TYPE.forEach(type => {
    Vue.options[key + 's'] = {}
  })

  Vue.options._base = Vue  // Vue的构造函数

  initExtend(Vue)
  initAssetRegisters(Vue)
}