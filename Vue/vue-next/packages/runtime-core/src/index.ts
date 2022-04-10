import { reactive } from "@vue/reactivity"
import { ShapeFlags } from "packages/shared/src/shapeFlags"
import { createAppAPI } from "./apiCreateApp"

/*
 * @Author: water.li
 * @Date: 2022-04-09 17:32:20
 * @Description: 
 * @FilePath: \notebook\Vue\vue-next\packages\runtime-core\src\index.ts
 */
export * from "@vue/reactivity"

export function createComponentInstance(vnode) {
  const type = vnode.type
  const instance = {
    vnode, // 实例对应的虚拟节点
    type,
    subTree: null, // 组件渲染后的内容
    ctx: {}, // 组件的上下文
    props: {},
    attrs: {}, // 除了props中的属性
    slots: {},
    setupState: {}, // setup返回的状态  
    propsOptions: type.props,
    proxy: null,
    render: null,
    emit: null,
    exposed: {}, // 暴露的方法
    isMounted: false // 是否挂载完成
  }
  instance.ctx = {_: instance}

  return instance
}

export function initProps(instance, rawProps) {
  const props = {}
  const attrs = {}
  const options = Object.keys(instance.propsOptions)
  if (rawProps) {
    for (let key of rawProps) {
      const value = rawProps[key]
      if (options.includes(key)) {
        props[key] = value
      } else {
        attrs[key] = value
      }
    }
  }
  instance.props = reactive(props)
  instance.props = attrs  // 这个attrs是非响应式的
}

export function setupComponent(instance) {
  const {props, children} = instance.vnode
  // 组件的props做初始化 attrs也要初始化
  initProps(instance, props)
  // 插槽的初始化
}

export function createRenderer(renderOptions) {

  const mountComponent = (initialVNode, container) => {
    // 根据组件的虚拟节点 创造一个真实节点，渲染到容器中
    // 1.我们要给这个组件创建一个组件的实例 
    const instance = initialVNode.component = createComponentInstance(initialVNode)

    // 2.给组件的实例时行赋值操作
    setupComponent(instance) // 给实例赋属性
  }

  const processComponent = (n1, n2, container) => {
    if (n1 === null) {
      // 组件的初始化 直接挂载
      mountComponent(n2, container)
    } else {
      // 组件的更新
    }
  }
  
  const patch = (n1, n2, container) => {
    if (n1 === n2) return 
    const {shapFlag} = n2
    if (shapFlag & ShapeFlags.COMPONENT) {
      processComponent(n1, n2, container)
    }
  }

  const render = (vnode, container) => { 
    patch(null, vnode, container)
  }

  return {
    createApp: createAppAPI(render),
    render
  }
}