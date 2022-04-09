/*
 * @Author: water.li
 * @Date: 2022-04-09 17:32:03
 * @Description: 
 * @FilePath: \notebook\Vue\vue-next\packages\runtime-dom\src\index.ts
 */

import { createRenderer } from "@vue/runtime-core"
import { nodeOps } from "./nodeOps"
import { patchProp } from "./patchProp"

const renderOptions = Object.assign(nodeOps, {patchProp})

export const createApp = (component, rootProps = null) => {
  const {createApp} = createRenderer(renderOptions) // runtime-core中的方法
  let app = createApp(component, rootProps)
  let {mount} = app // 获取runtime-core中的方法
  app.mount = function(container) { // 再重写mount
    container = nodeOps.querySelector(container)
    container.innerHTML = ''
    mount(container) // 处理节点后传入到mount中
  }
  return app
}



export * from "@vue/runtime-core"
