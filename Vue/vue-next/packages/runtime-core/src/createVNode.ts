/*
 * @Author: water.li
 * @Date: 2022-04-09 23:32:29
 * @Description: 
 * @FilePath: \notebook\Vue\vue-next\packages\runtime-core\src\createVnode.ts
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
    
    vnode.shapFlag ||= isString(children) ? ShapeFlags.TEXT_CHILDREN : ShapeFlags.ARRAY_CHILDREN
  }
  return vnode
}
