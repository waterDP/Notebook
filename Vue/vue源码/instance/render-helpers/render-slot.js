/*
 * @Author: water.li
 * @Date: 2022-10-08 21:51:02
 * @Description:
 * @FilePath: \note\Vue\vue源码\instance\render-helpers\render-slot.js
 */

import { extend } from "../../shared/utils"

export function renderSlot(name, fallbackRender, props, bindObject) {
  const scopedSlotFn = this.$scopedSlots[name]
  let nodes

  if (scopedSlotFn) {
    props = props || {}
    if (bindObject) {
      props = extend(extend({}, bindObject), props)
    }
    nodes = 
      scopedSlotFn(props) ||
      (typeof fallbackRender === 'function' ? fallbackRender() : fallbackRender)
  } else {
    nodes =
      this.$slots[name] ||
      (typeof fallbackRender === 'function' ? fallbackRender() : fallbackRender)
  }
  
  const target = props && props.slot

  return target ? this.$createElement('template', {slot: target}, nodes) : nodes
}