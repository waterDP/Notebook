import {initMixin} from './init'
import {renderMixin} from './render'
import {lifecycleMixin} from './lifecycle'
import {initGlobalAPI} from './global-api'
import {stateMixin} from './state'

function Vue(options) {
  // 进行初始化的
  this._init(options)
}

initMixin(Vue)
renderMixin(Vue)
lifecycleMixin(Vue)
stateMixin(Vue)

// 初始化全局api
initGlobalAPI(Vue)

export default Vue