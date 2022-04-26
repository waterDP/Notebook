/*
 * @Author: water.li
 * @Date: 2022-04-08 21:36:34
 * @Description: 
 * @FilePath: \notebook\Vue\vue-next\packages\reactivity\src\effect.ts
 */

let effectStack = [] // 栈结构
let activeEffect

function cleanupEffect(effect: ReactiveEffect) {
  const {deps} = effect
  for (let dep of deps) {
    dep.delete(effect) // 让属性对应的effect移除掉，这样属性更新的时候 就不会触发这个effect重新执行了
  }
}

export class ReactiveEffect { 
  active = true
  deps = []
  constructor(public fn: Function, public scheduler?: Function) { // 让effect记录他依赖了哪些属性，同时要记录当前属性依赖了哪个effect

  }
  run() {
    if (!this.active) { // 稍后如果非激活状态调用run方法 默认会执行fn函数
      return this.fn()
    } 
    if (!effectStack.includes(this)) {
      try {
        effectStack.push(activeEffect = this)
        return this.fn() // 执行函数 effect new Proxy会执行get方法 get中会调用track收集依赖
      } finally {
        // 弹栈 
        effectStack.pop()
        activeEffect = effectStack[effectStack.length - 1]
      }
    }
  }
  stop() { // 让effect和dep取消关联 dep上面的effect移除掉即可
    if (this.active) {
      cleanupEffect(this)
      this.active = false
    }
  }
}

export function isTracking(): boolean {
  return activeEffect !== undefined
}

// {对象：{属性: [effect1, effect2]}}
const targetMap = new WeakMap()
export function track(target, key) {
  if (!isTracking()) return // 如果这个属性，不依赖于effect直接跳出即可

  let depsMap = targetMap.get(target)
  depsMap || targetMap.set(target, (depsMap = new Map()))

  let dep = depsMap.get(key)
  dep || depsMap.set(key, (dep = new Set<ReactiveEffect>()))
  trackEffects(dep)
}

export function trackEffects(dep: Set<ReactiveEffect>) {
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect)
    activeEffect.deps.push(dep)  // dep是一个Set集合
  }
}

export function trigger(target, key) {
  let depsMap = targetMap.get(target)
  if (!depsMap) return // 修改的属性根本没有依赖任何effect
  let deps = []
  if (key !== undefined) {
    deps.push(depsMap.get(key))
  }
  let effects = []
  for (const dep of deps) {
    effects.push(...dep)
  }
  triggerEffects(effects)
}

export function triggerEffects(dep) {
  for (const effect of dep) { // 如果当前effect执行和要执行的effect是同一个，不要执行了 防止循环
    if (effect !== activeEffect) {
      if (effect.scheduler) {
        effect.scheduler()
      } else {
        effect.run()
      }  
    }
  }
}

export function effect(fn: Function) {
  const _effect = new ReactiveEffect(fn)

  _effect.run() // 会默认让fn执行一次 
  
  let runner = _effect.run.bind(_effect)
  runner.effect = _effect
  return runner
}
