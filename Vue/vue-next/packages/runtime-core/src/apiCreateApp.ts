/*
 * @Author: water.li
 * @Date: 2022-04-09 22:57:35
 * @Description: 
 * @FilePath: \notebook\Vue\vue-next\packages\runtime-core\src\apiCreateApp.ts
 */

import { createVNode } from "./createVnode"


export function createAppAPI(render) {
  return (rootComponent, rootProps) => {
    let isMounted = false
    const app = {
      mount(container) {
        // 1. 创建组件虚拟节点
        let vnode = createVNode(rootComponent, rootProps)
        // 2. 挂载的核心就是根据传入的组件对象 创造一个组件的虚拟节点 再将这个节点渲染到容器中
        render(vnode, container)
        if (!isMounted) {
          isMounted = true
        }
      }
    }

    return app
  }
}