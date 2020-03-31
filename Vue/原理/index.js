import Watcher from "./observer/watcher";
import {render, patch, h} from "./vdom"
import {initState} from "./observer"

function Vue(options) {
  this._init(options)
}

// 初始化
Vue.prototype._init = function(options) {
  let vm = this;
  vm.$options = options

  // MVVM 需要将数据重新初始化
  initState(vm)

  // 初始化工作 
  if (vm.$options.el) {
    vm.$mount()
  }
}

function query(el) {
  if (typeof el === 'string') {
    return document.querySelector(el)
  }
  return el
}

Vue.prototype._update = function (vnode) {
  // 用传入的数据去更新视图
  let vm = this;
  let el = vm.$el; 
  let preVnode = vm.preVnode  // 第一次没有
  if(!preVnode) { // 初始渲染
    vm.preVnode = vnode;  // 把上一次的节点保存起来
    vm.$el = render(vnode, el)
  } else { // vue 更新操作
    vm.$el = patch(preVnode, vnode)
  }
}

Vue.prototype._render = function() {
  let vm = this;
  let render = vm.$options.render  // 获取用户编写的render方法

  let vnode = render.call(vm, h)
  return vnode
}

// 渲染页面 将组件进行挂载
Vue.prototype.$mount = function () {
  let vm = this
  let el = vm.$options.el
  el = vm.$el = query(el)

  // 渲染是通过watcher来渲染的
  // 渲染watcher用于渲染的watcher
  // vue 2.0 组件级别更新 new Vue
  let updateComponent = () => {
    vm._update(vm._render())
  } 
  new Watcher(vm, updateComponent) // 渲染watcher
}

Vue.prototype.$watch = function(expr, handler, opts) {
  // 原理 创建一个Watcher
  let vm = this
  new Watcher(vm, expr, handler, {user: true, ...opts})
}

export default Vue