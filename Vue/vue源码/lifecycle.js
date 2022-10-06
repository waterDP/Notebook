import Watcher from './observer/watcher'
import {noop} from './util/index'
import {patch} from './vnode/patch'

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function(vnode) {
    let vm = this
    const prevVnode = vm._vnode
    // 第一次默认不需要diff算法
    vm._vnode = vnode
    if (!prevVnode) {
      // 我要通过通过虚拟节点，渲染出真实的dom
      vm.$el = patch(vm.$el, vnode)
    } else {
      vm.$el = patch(prevVnode, vnode)
    }
 
  }

  Vue.prototype.$forceUpdate = function () {
    const vm = this
    if (vm._watcher) {
      vm._watcher.update()
    }
  }
}

export function mountComponent(vm, el) {
  vm.$el = el // 真实的dom元素

  callHook(vm, 'beforeMount')
  // 渲染页面
  // 无论是渲染还是更新，都会调用此方法
  // vm._render 通过解析的render方法 渲染出虚拟dom
  // vm._update 通过虚拟dom创建真实的dom
  let updateComponent = function() {  
    // 返回的是虚拟dom
    vm._update(vm._render())
  }
  // ! 渲染watcher 每个组件都有一个渲染watcher
  new Watcher(vm, updateComponent, noop, {}, true /* isRenderWatcher */)
  callHook(vm, 'mounted')
}

export function callHook(vm, hook) {
  // 找到时对应的钩子，依次执行
  const handlers = vm.$options[hook]
  if (handlers) {
    handlers.forEach(handle => {
      handle.call(vm)
    })
  }
}