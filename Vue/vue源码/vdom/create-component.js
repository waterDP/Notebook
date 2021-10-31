import { isObject } from "../util/index"
import {vnode} from './vnode'

export function createComponent(vm, tag, data, key, children, Ctor) {
  if (isObject(Ctor)) {
    Ctor = vm.$options._base.extend(Ctor)
  }
  data.hook = {
    init(vnode) {
      // 当前组件的实例
      let child = vnode.componentInstance = new Ctor({_isComponent: true})
      child.$mount()
    }
  }
  return vnode(`vue-component-${Ctor.cid}-${tag}`, data, key, undefined, {Ctor, children})
}