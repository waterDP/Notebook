/*
 * @Author: water.li
 * @Date: 2022-04-09 16:46:08
 * @Description:
 * @FilePath: \Notebook\Vue\vue-next\packages\reactivity\src\ref.ts
 */

import { isTracking, trackEffects, triggerEffects } from "./effect";
import { toReactive } from "./reactive";

export function isRef(value) {
  return !!(value && value.__v_isRef);
}

class RefImpl {
  public dep = new Set();
  public __v_isRef = true;
  public _value;
  constructor(public _rawValue) {
    // _rawValue如果用户传进来的值是一个对象，需要将对象转换成响应式
    this._value = toReactive(_rawValue);
  }
  get value() {
    // 取值的时候进行依赖收集
    if (isTracking()) {
      trackEffects(this.dep);
    }
    return this._value;
  }
  set value(newValue) {
    // 设置的时候触发更新
    if (newValue !== this._rawValue) {
      this._rawValue = newValue;
      this._value = toReactive(newValue);
      triggerEffects(this.dep);
    }
  }
}

export function ref(value) {
  return new RefImpl(value);
}

class ObjectRefImpl {
  public __v_isRef = true;
  constructor(private _object, private _key) {}
  get value() {
    return this._object[this._key];
  }
  set value(newVal) {
    this._object[this._key] = newVal;
  }
}

export function toRef(object, key) {
  return new ObjectRefImpl(object, key);
}

export function toRefs(object) {
  let ret = Array.isArray(object)
    ? new Array(object.length)
    : Object.create(null);

  for (let key in object) {
    ret[key] = toRef(object, key);
  }

  return ret;
}

export function proxyRefs(object) {
  return new Proxy(object, {
    get(target, key, receiver) {
      let v = Reflect.get(target, key, receiver);
      return isRef(v) ? v.value : v;
    },
    set(target, key, value, receiver) {
      let oldValue = Reflect.get(target, key, receiver);
      if (isRef(oldValue)) {
        // 如果是给ref赋值 应该给他的value赋值
        oldValue.value = value;
        return true;
      }
      // 其它情况下直接赋值即可
      return Reflect.set(target, key, value, receiver);
    },
  });
}
