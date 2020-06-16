import { createElement, createTextNode } from './vdom/create-element'
import {nextTick} from './util/next-tick'

export function renderMixin(Vue) {
  // _c 创建元素的虚拟节点
  // _v 创建文本的虚拟节点
  // _s JSON.stringify
  Vue.prototype._c = function (...args) {
    return createElement(this, ...args)
  }
 
  Vue.prototype._v = function (text) {
    return createTextNode(this, text)
  }

  Vue.prototype._s = function (val) {
    return val === null ? '' : (typeof val === 'object' ? JSON.stringify(val) : val)
  }

  Vue.prototype._render = function (params) {
    const vm = this
    const { render } = vm.$options.render
    let vnode = render.call(vm)
    return vnode
  }

  // todo 全局添加$nextTick 方法
  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  }
}