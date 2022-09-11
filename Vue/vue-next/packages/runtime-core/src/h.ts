/*
 * @Author: water.li
 * @Date: 2022-09-09 22:41:33
 * @Description: 
 * @FilePath: \note\Vue\vue-next\packages\runtime-core\src\h.ts
 */

import { isObject } from "@vue/shared"
import { createVNode, isVNode } from "./createVnode"

export function h(type, propsOrChildren, children) {
  // 写法1 h('div', {color: red})
  // 写法2 h('div', h('span'))
  // 写法3 h('div', 'hello')
  // 写法4 h('div',['hello', 'hello'])
  const len = arguments.length
  if (len === 2) {
    if (isObject(propsOrChildren) && Array.isArray(propsOrChildren)) {
      if (isVNode(propsOrChildren)) {
        return createVNode(type, null, [propsOrChildren])
      }
      return createVNode(type, propsOrChildren)
    } else {
      return createVNode(type, null, propsOrChildren)
    }
  } else {
    if (len > 3) {
      children = Array.prototype.slice.call(arguments, 2)
    } else if (len === 3 && isVNode(children)) {
      children = [children]
    }
    return createVNode(type, propsOrChildren, children)
  }

  // h('div', {}, children)
  // h('div', {}, ['child', 'child'])
  // h('div', {}, [h('span'), h('span')])
}
