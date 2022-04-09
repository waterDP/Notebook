/*
 * @Author: water.li
 * @Date: 2022-04-09 16:46:08
 * @Description: 
 * @FilePath: \notebook\Vue\vue-next\packages\reactivity\src\ref.ts
 */

import { isTracking, trackEffects, triggerEffects } from "./effect"
import { toReactive } from "./reactive"

class RefImpl {
  public dep
  public __v_isRef
  public _value
  constructor(public _rawValue) {
    this._value = toReactive(_rawValue)
  }
  get value() { // 取值的时候进行依赖收集
    if (isTracking()) {
      trackEffects(this.dep || (this.dep = new Set()))
    }
    return this._value
  }
  set value(newValue) {  // 设置的时候触发更新 
    if (newValue !== this._rawValue) {
      this._rawValue = newValue
      this._value = toReactive(newValue)
      triggerEffects(this.dep)
    }
  }
}

function createRef(value) {
  return new RefImpl(value)
}

export function ref(value) {
  return createRef(value)
}

export function shallowRef(value) {
  //...
}