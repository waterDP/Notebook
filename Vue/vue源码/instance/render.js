/*
 * @Author: water.li
 * @Date: 2022-04-16 20:38:06
 * @Description: 
 * @FilePath: \Notebook\Vue\vue源码\instance\render.js
 */

import { createElement } from '../vdom/create-element'
import { installRenderHelpers } from './render-helpers'
import {nextTick} from '../util/next-tick'

export function initRender(vm) {
  vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)
}

export function renderMixin(Vue) {

  installRenderHelpers(Vue)
  Vue.prototype._render = function () {
    const vm = this
    const { render } = vm.$options
    let vnode = render.call(vm, vm.$createElement)
    return vnode
  }

  // todo 全局添加$nextTick 方法
  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  }
}