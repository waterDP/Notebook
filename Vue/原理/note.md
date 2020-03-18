## 从源码角度分析组件的渲染原理
默认会创建一个渲染watcher
1.vm._render() 会创建对应的虚拟节点
  会调用createElement()
2.vm._update() 去用虚拟节点创建真实节点(patch)
  vm._update(vm._render(), hydrating)