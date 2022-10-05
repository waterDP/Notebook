/*
 * @Author: water.li
 * @Date: 2022-04-16 20:38:06
 * @Description: 
 * @FilePath: \note\Vue\vue源码\vdom\create-element.js
 */
import {createComponent} from './create-component'
import {vnode} from './vnode'
import {isReservedTag} from '../util/index'

export function createElement(vm, tag, data={}, ...children) {
  let key = data.key
  delete data.key
  if (isReservedTag(tag)) {
    return vnode(tag, data, key, children, undefined)
  }
   
  // 组件
  let Ctor = vm.$options.components[tag] // 找到组件的定义
  return createComponent(vm, tag, data, key, children, Ctor)
}

export function createTextNode(vm, text) {
  return vnode(undefined, undefined, undefined, undefined, text)
}
