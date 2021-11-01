/*
 * @Author: your name
 * @Date: 2021-11-01 10:16:56
 * @LastEditTime: 2021-11-01 11:36:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \notebook\Vue\vue3源码\packages\reactivity\effect.ts
 */

// effect 收集依赖，更新视图
export function effect(fn, options: any = {}) {
  const effect = createReactiveEffect(fn, options)
  if (!options.lazy) {
    effect()
  }
  return effect
}

let uid = 0
let activeEffect  // 保存当前的effect
const effectStack = []

function createReactiveEffect(fn, options) {
  const effect = function reactiveEffect() {
    if (!effectStack.includes(effect)) {  // 保证effect 没有加入effectStack
      try {
        // 入栈
        effectStack.push(effect)
        activeEffect = effect
        fn()
      } finally {
        // 出栈
        effectStack.pop()
        activeEffect = effectStack[effectStack.length - 1]
      }
    }
  }
  effect.id = uid++ // 区别effect
  effect._isEffect = true  // 区别effect 是不是响应式的effect
  effect.raw = fn  // 保存 用户的方法
  effect.options = options
  return effect
}

let targetMap = new WeakMap()
export function track(target, type, key) {
  // key 和 effect 一一对应  map
  if (activeEffect === undefined) {  // 没有在effect中使用
    return 
  }
  
  let depMap = targetMap.get(target)
  if (!depMap) {
    targetMap.set(target, (depMap = new Map))
  } 
  
  let dep = depMap.get(key)
  if (!dep) {
    depMap.set(key, (dep = new Set))
  }
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect)
  }
}