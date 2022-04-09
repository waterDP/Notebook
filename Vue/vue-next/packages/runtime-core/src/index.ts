import { ShapeFlags } from "packages/shared/src/shapeFlags"
import { createAppAPI } from "./apiCreateApp"

/*
 * @Author: water.li
 * @Date: 2022-04-09 17:32:20
 * @Description: 
 * @FilePath: \notebook\Vue\vue-next\packages\runtime-core\src\index.ts
 */
export * from "@vue/reactivity"

export function createRenderer(renderOptions) {

  const mountComponent = (initialVNode, container) => {
    // 根据组件的虚拟节点 创造一个真实节点，渲染到容器中

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