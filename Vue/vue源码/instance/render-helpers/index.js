/*
 * @Author: water.li
 * @Date: 2022-10-08 20:57:43
 * @Description: 
 * @FilePath: \note\Vue\vue源码\instance\render-helpers\index.js
 */
import { renderList } from "./render-list"
import { createEmptyVnode, createTextVNode } from '../../vdom/vnode'
import { toString } from '../../shared/utils'
import { createElement } from "../../vdom/create-element"
import { renderSlot } from "./render-slot"

export function installRenderHelpers(Vue) {
  // _c 创建元素的虚拟节点
  // _v 创建文本的虚拟节点
  // _s JSON.stringify
  // _t slot 插槽
  // _l list v-for 处理v-for的
  Vue.prototype._c = createElement
  Vue.prototype._s = toString
  Vue.prototype._t = renderSlot
  Vue.prototype._v = createTextVNode
  Vue.prototype._l = renderList
  Vue.prototype._e = createEmptyVnode
}