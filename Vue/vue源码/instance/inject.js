/*
 * @Author: water.li
 * @Date: 2022-10-07 13:12:37
 * @Description: 
 * @FilePath: \note\Vue\vue源码\instance\inject.js
 */
import { defineReactive, toggleObserving } from '../observer/index'

export function initProvide(vm) {
  const provide = vm.$options.provide
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide
  }
}

export function initInjections(vm) {
  const result = resolveInject(vm.$options.inject, vm)
  if (result) {
    toggleObserving(false)
    Object.keys(result).forEach(key => {
      defineReactive(vm, key, result[key])
    })
    toggleObserving(true)
  }
}

export function resolveInject(inject, vm) {
  if (inject) {
    const result = Object.create(null)
    const keys = Object.keys(inject)

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      if (key === '__ob__') continue
      const provideKey = inject[key].from
      let source = vm
      while(source) {
        if (source._provided && source._provided[provideKey]) {
          result[key] = source._provided[provideKey]
          break
        }
        source = source.$parent
      }
    }
    
    return result
  }
}
