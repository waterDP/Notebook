/*
 * @Author: water.li
 * @Date: 2022-10-07 13:51:09
 * @Description: 
 * @FilePath: \note\Vue\vue源码\instance\events.js
 */

import { toArray, invokeWithErrorHandling } from "../util"

export function initEvents(vm) {
  vm._events = Object.create(null)
  vm._hasHookEvents = false
  const listeners = vm.$options._parentListeners
  if (listeners) {
    updateComponentListeners(vm, listeners)
  }
}

let target

function add(event, fn) {
  target.$on(event, fn)
}

function remove(event, fn) {
  target.$off(event, fn)
}

function createOnceHandler(event, fn) {
  const _target = target
  return function onceHandler() {
    const res = fn.apply(null, arguments)
    if (res !== null) {
      _target.$off(event, onceHandler)
    }
  }
}

export function updateComponentListeners(vm, listeners, oldListners) {
  target = vm
  updateListeners(listeners, oldListners || {}, add, remove, createOnceHandler, vm)
  target = undefined
}


export function eventMixin(Vue) {
  const hookRE = /^hook:/

  Vue.prototype.$on = function (event, fn) { 
    const vm = this
    if (Array.isArray(event)) {
      for (let i = 0; i < event.length; i++) {
        vm.$on(event[i], event) // ? 递归
      }
    } else {
      ;(vm._events[event] || (vm._events[event] = [])).push(fn)
      if (hookRE.test(event)) {
        vm._hasHookEvents = true
      }
    }
    return vm
  }

  Vue.prototype.$once = function (event, fn) { 
    const vm = this
    function on() {
      vm.$off(event, on)
      fn.apply(vm, arguments)
    }
    vm.$on(event, on)
    return vm
  }

  Vue.prototype.$off = function (event, fn) {
    const vm = this
    if (!arguments.length) {
      vm._events = Object.create(null)
      return vm
    }
    if (isArray(event)) {
      for (let i = 0, l = event.length; i < l; i++) {
        vm.$off(event[i], fn)
      }
      return vm
    }
    return vm
  }

  /**
   * @param {string} event
   */
  Vue.prototype.$emit = function (event) {
    const vm = this
    let cbs = vm._events[event]
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs
      const args = toArray(arguments, 1)
      for (let i = 0; i < cbs.length; i++) {
        const handler = cbs [i]
        handler.apply(vm, args)
      }
    }
    return vm
  }
}