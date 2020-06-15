import Watcher from './observer/watcher'
import {noop} from './util'
import {patch} from './vnode/patch'

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function(vnode) {
    let vm = this
    // 我要通过通过虚拟节点，渲染出真实的dom
    vm.$el = patch(vm.$el, vnode)
  }
}

export function mountComponent(vm, el) {
  const options = vm.$options // render
  vm.$el = el // 真实的dom元素

  // 渲染页面
  // 无论是渲染还是更新，都会调用此方法
  // vm._render 通过解析的render方法 渲染出虚拟dom
  // vm._update 通过虚拟dom创建真实的dom
  let updateComponent = function() {  
    // 返回的是虚拟dom
    vm._update(vm._render())
  }
  // 渲染watcher 每个组件都有一个渲染watcher
  new Watcher(vm, updateComponent, noop, {}, {renderWatcher: true}) // true 表示他是一个渲染watcher
}