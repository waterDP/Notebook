export function mountComponent(vm, el) {
  const options = vm.$options // render
  vm.$el = el // 真实的dom元素

  // 渲染页面
  // 无论是渲染还是更新，都会调用此方法
  let updateComponent = function() {  
    // 返回的是虚拟dom
    vm._update(vm._render())
  }
  // 渲染watcher 每个组件都有一个渲染watcher
}