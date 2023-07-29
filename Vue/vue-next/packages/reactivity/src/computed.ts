/*
 * @Author: water.li
 * @Date: 2022-04-08 23:39:15
 * @Description:
 * @FilePath: \Notebook\Vue\vue-next\packages\reactivity\src\computed.ts
 */

import { isFunction } from "@vue/shared";
import {
  isTracking,
  ReactiveEffect,
  trackEffects,
  triggerEffects,
} from "./effect";

class ComputedRefImpl {
  public dep = new Set();
  public _dirty = true;
  public __v_isRef = true;
  public effect;
  public _value;
  constructor(getter, public setter) {
    // 这里将计算属性包成一个effect
    this.effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true; //让计算属性标记为脏值
        // 当依赖的值发生变化了 也应该触发更新
        triggerEffects(this.dep);
      }
    });
  }
  get value() {
    // 取值时
    if (isTracking()) {
      // 是否是在effect取值的
      trackEffects(this.dep);
    }
    if (this._dirty) {
      // _dirty实现缓存
      this._value = this.effect.run();
      this._dirty = false;
    }
    return this._value;
  }
  set value(newValue) {
    this.setter(newValue);
  }
}

export function computed(getterOrOption) {
  const onlyGetter = isFunction(getterOrOption);

  let getter, setter;
  if (onlyGetter) {
    getter = getterOrOption;
    setter = () => {};
  } else {
    getter = getterOrOption.get;
    setter = getterOrOption.set;
  }

  return new ComputedRefImpl(getter, setter);
}
