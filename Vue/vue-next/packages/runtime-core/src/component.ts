/*
 * @Author: water.li
 * @Date: 2022-09-09 20:44:25
 * @Description: 
 * @FilePath: \note\Vue\vue-next\packages\runtime-core\src\component.ts
 */
import { reactive } from "@vue/reactivity"
import { hasOwn, isFunction, isObject } from "@vue/shared"

export function createComponentInstance(vnode) {
  const type = vnode.type // 用户自己传入的属性
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
    expose: {}, // 暴露的方法
    isMounted: false // 是否挂载完成
  }
  instance.ctx = {_: instance} // 后续会对他进行代理

  return instance
}

export function initProps(instance, rawProps) {
  const props = {}
  const attrs = {}
  const options = Object.keys(instance.propsOptions) // 用户注册过的
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

function createSetupContext(instance) {
  return {
    attrs: instance.attrs,
    slots: instance.slots,
    emit: instance.emit,
    expose: (expose) => instance.expose = expose || {}
  }
}

const PubliceInstanceHandlers = {
  get({_:instance}, key) {
    const {setupState, props} = instance
    if (hasOwn(setupState, key)) {
      return setupState[key]
    }
    if (hasOwn(props, key)) {
      return props[key]
    }
    // ...
  },
  set({_:instance}, key, value){
    const {setupState, props} = instance
    if (hasOwn(setupState, key)) {
      setupState[key] = value
    } else if (hasOwn(props, key)) {
      return false
    }
    return
  }
}

export function setupStatefulComponent(instance) {
  // 核心就是调用setup方法 
  const Component = instance.type
  const {setup} = Component
  instance.proxy = new Proxy(instance.ctx, PubliceInstanceHandlers)
  if (setup) {
    const setupContext = createSetupContext(instance)
    let setupResult = setup(instance.props, setupContext)
    if (isFunction(setupResult)) {
      instance.render = setupResult // 如果setup返回的是函数 那么就是render函数
    } else if (isObject(setupResult)) {
      instance.setupState = setupResult
    }
  }
  if (!instance.render) {
    // 如果 没有render而写的是template 可能要做模板编译
    instance.render = Component.render
  }
}

export function setupComponent(instance) {
  const {props, children} = instance.vnode
  // 组件的props做初始化 attrs也要初始化
  initProps(instance, props)
  // 插槽的初始化

  setupStatefulComponent(instance) // 这个方法的目的就是调用setup函数 拿到返回值
}