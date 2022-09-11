/*
 * @Author: water.li
 * @Date: 2022-04-09 23:32:29
 * @Description: 
 * @FilePath: \note\Vue\vue-next\packages\runtime-core\src\createVNode.ts
 */

import { isObject, isString } from "@vue/shared"
import { ShapeFlags } from "packages/shared/src/shapeFlags"


export function createVNode(type, props, children = null) {

  const shapFlag = isObject(type) 
    ? ShapeFlags.COMPONENT 
    : isString(type) 
      ? ShapeFlags.ELEMENT 
      : 0

  const vnode = {
    __v_isVnode: true,
    type,
    shapFlag,
    props,
    children,
    key: props && props.key,
    component: null, // 如果是组件的虚拟节点，要保存组件的实例
    el: null  // 虚拟节点对应的真实节点
  }
  if (children) { 
    vnode.shapFlag |= isString(children) ? ShapeFlags.TEXT_CHILDREN : ShapeFlags.ARRAY_CHILDREN
  }
  return vnode
}

export function isVNode(vnode) {
  return !!vnode.__v_isVnode
}

export const Text = Symbol()

export function normalizeVNode(vnode) {
  if (isObject(vnode)) {
    return vnode
  }
  return createVNode(Text, null, String(vnode))
}

export function isSameVNodeType(n1, n2) {
  return n1.type === n2.type && n1.key === n2.key
}