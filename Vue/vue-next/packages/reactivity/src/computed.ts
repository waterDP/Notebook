/*
 * @Author: water.li
 * @Date: 2022-04-08 23:39:15
 * @Description: 
 * @FilePath: \notebook\Vue\vue-next\packages\reactivity\src\computed.ts
 */

import { isFunction } from "@vue/shared";
import { isTracking, ReactiveEffect, trackEffects, triggerEffects } from "./effect";

class ComputedRefImpl {
  public dep
  public _dirty = true
  public __v_isRef = true
  public effect
  public _value
  constructor(getter, public setter) {
    // 这里将计算属性包成一个effect
    this.effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true
        triggerEffects(this.dep)
      }
    })
    
  }
  get value() { // 取值时
    if (isTracking()) {
      trackEffects(this.dep || (this.dep = new Set()))
    }
    if (this._dirty) {
      this._value = this.effect.run()
      this._dirty = false
    }
    return this._value
  }
  set value(newValue) {
    this.setter(newValue)
  }
}

export function computed(getterOrOption) {
  const onlyGetter = isFunction(getterOrOption)

  let getter, setter
  if (onlyGetter) {
    getter = getterOrOption
    setter = () => {}
  } else {
    getter = getterOrOption.get
    setter = getterOrOption.set
  }
  
  return new ComputedRefImpl(getter, setter)
}