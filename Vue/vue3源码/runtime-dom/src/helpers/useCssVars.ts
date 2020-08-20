import {
  ComponentPublicInstance,
  getCurrentInstance,
  onMounted,
  watchEffect,
  warn,
  VNode,
  Fragment,
  unref
} from '@vue/runtime-core'
import { ShapeFlags } from '@vue/shared/src'

export function useCssVars(
  getter: (ctx: ComponentPublicInstance) => Record<string, string>,
  scoped = false
) {
  const instance = getCurrentInstance()
  /* istanbul ignore next */
  if (!instance) {
    __DEV__ &&
      warn(`useCssVars is called without current active component instance.`)
    return
  }

  const prefix =
    scoped && instance.type.__scopeId
      ? `${instance.type.__scopeId.replace(/^data-v-/, '')}-`
      : ``

  onMounted(() => {
    watchEffect(() => {
      setVarsOnVNode(instance.subTree, getter(instance.proxy!), prefix)
    })
  })
}

function setVarsOnVNode(
  vnode: VNode,
  vars: Record<string, string>,
  prefix: string
) {
  if (__FEATURE_SUSPENSE__ && vnode.shapeFlag & ShapeFlags.SUSPENSE) {
    const { isResolved, isHydrating, fallbackTree, subTree } = vnode.suspense!
    if (isResolved || isHydrating) {
      vnode = subTree
    } else {
      vnode.suspense!.effects.push(() => {
        setVarsOnVNode(subTree, vars, prefix)
      })
      vnode = fallbackTree
    }
  }

  // drill down HOCs until it's a non-component vnode
  while (vnode.component) {
    vnode = vnode.component.subTree
  }

  if (vnode.shapeFlag & ShapeFlags.ELEMENT && vnode.el) {
    const style = vnode.el.style
    for (const key in vars) {
      style.setProperty(`--${prefix}${key}`, unref(vars[key]))
    }
  } else if (vnode.type === Fragment) {
    ;(vnode.children as VNode[]).forEach(c => setVarsOnVNode(c, vars, prefix))
  }
}
