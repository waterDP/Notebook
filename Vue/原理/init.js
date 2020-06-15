import {initState} from './state'
import {compilerToFunction} from './compiler'
import {mountComponent} from './lifecycle'

export function initMixin(Vue) {
  // 初始化流程
  Vue.prototype._init = function(options) {
    // 数据的劫持
    const vm = this
    vm.$options = options
    // 初始化状态
    initState(vm)

    // 如果用户传入了el属性，需要将页面渲染出来
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }

  Vue.prototype.$mount = function(el) {
    const vm = this
    const options = vm.options
    el = document.querySelect(el)

    if (!options.render) {
      let template = options.template
      if (!template) {
        template = el.outerHTML
      }
      const render = compilerToFunction(template)
      options.render = render
    }

    // 渲染当前的组件 挂载当前的组件
    mountComponent(vm, el)
  }
}