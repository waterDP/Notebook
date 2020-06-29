import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

// todo 定义Vue构造函数
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  // 这个函数在initMixin中定义
  this._init(options)
}

initMixin(Vue) // _init
stateMixin(Vue) // $set, $delete $watch
eventsMixin(Vue) // $on $emit $off $once
lifecycleMixin(Vue) // _update vdom => dom
renderMixin(Vue) // _render $nextTick(代理)

export default Vue
