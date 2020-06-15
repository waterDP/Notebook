import {initMixin} from './init'
import {renderMixin} from './render'
import {lifecycleMixin} from './lifecycle'

function Vue() {
  // 进行初始化的
  this._init(options)
}

initMixin(Vue)
renderMixin(Vue)
lifecycleMixin(Vue)
export default Vue