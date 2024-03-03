/*
 * @Author: water.li
 * @Date: 2022-04-08 21:36:34
 * @Description:
 * @FilePath: \Notebook\Vue\vue-next\packages\reactivity\src\effect.ts
 */
let activeEffect; // 当前激活的effect

function cleanupEffect(effect: ReactiveEffect) {
  const { deps } = effect; // deps = [Set Set Set]
  for (let dep of deps) {
    // dep是Set
    dep.delete(effect); // 让属性对应的effect移除掉，这样属性更新的时候 就不会触发这个effect重新执行了
  }
  effect.deps.length = 0;
}

export class ReactiveEffect {
  active = true;
  deps = []; // 依赖了哪些列表
  parent = null;
  constructor(public fn, public scheduler?) {
    // 让effect记录他依赖了哪些属性，同时要记录当前属性依赖了哪个effect
  }
  run() {
    if (!this.active) {
      // 稍后如果非激活状态调用run方法 默认会执行fn函数
      // 不会发生依收集了
      return this.fn();
    }

    try {
      this.parent = activeEffect;
      activeEffect = this;
      cleanupEffect(this);
      return this.fn(); // 执行函数 effect new Proxy会执行get方法 get中会调用track收集依赖
    } finally {
      activeEffect = this.parent;
      this.parent = null;
    }
  }
  stop() {
    // 让effect和dep取消关联 dep上面的effect移除掉即可
    if (this.active) {
      cleanupEffect(this);
      this.active = false;
    }
  }
}

export function isTracking(): boolean {
  return activeEffect !== undefined;
}

// {对象：{属性: [effect1, effect2]}}
const targetMap = new WeakMap();
// todo 触发收集依赖
export function track(target, key) {
  if (!isTracking()) return; // 如果这个属性，不依赖于effect直接跳出即可

  let depsMap = targetMap.get(target);
  depsMap || targetMap.set(target, (depsMap = new Map()));

  let dep = depsMap.get(key);
  dep || depsMap.set(key, (dep = new Set()));
  trackEffects(dep);
}

export function trackEffects(dep) {
  if (!dep.has(activeEffect)) {
    // activeEffect就是当前的这个effect
    dep.add(activeEffect); // {对象: map{name: set[effect, effect]}}
    activeEffect.deps.push(dep); // dep是一个Set集合
  }
}

export function trigger(target, key, value, oldValue) {
  let depsMap = targetMap.get(target);
  if (!depsMap) return; // 修改的属性根本没有依赖任何effect
  let dep = depsMap.get(key);
  let effects = [...dep]; // 防止边删除，边添加时出现死循环

  triggerEffects(effects);
}

export function triggerEffects(effects) {
  for (const effect of effects) {
    // 如果当前effect执行和要执行的effect是同一个，不要执行了 防止循环
    if (effect !== activeEffect) {
      if (effect.scheduler) {
        // 计算属性中使用
        effect.scheduler();
      } else {
        effect.run();
      }
    }
  }
}

export function effect(fn: Function, options: any = {}) {
  const _effect = new ReactiveEffect(fn);

  _effect.run(); // 会默认让fn执行一次

  let runner = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}
