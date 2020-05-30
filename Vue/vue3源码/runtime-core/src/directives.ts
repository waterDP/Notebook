/**
Runtime helper for applying directives to a vnode. Example usage:

const comp = resolveComponent('comp')
const foo = resolveDirective('foo')
const bar = resolveDirective('bar')

return withDirectives(h(comp), [
  [foo, this.x],
  [bar, this.y]
])
*/

import { VNode } from './vnode'
import { isFunction, EMPTY_OBJ, makeMap } from '@vue/shared'
import { warn } from './warning'
import { ComponentInternalInstance, Data } from './component'
import { currentRenderingInstance } from './componentRenderUtils'
import { callWithAsyncErrorHandling, ErrorCodes } from './errorHandling'
import { ComponentPublicInstance } from './componentProxy'

export interface DirectiveBinding {
  instance: ComponentPublicInstance | null
  value: any
  oldValue: any
  arg?: string
  modifiers: DirectiveModifiers
  dir: ObjectDirective
}

export type DirectiveHook<T = any, Prev = VNode<any, T> | null> = (
  el: T,
  binding: DirectiveBinding,
  vnode: VNode<any, T>,
  prevVNode: Prev
) => void

export type SSRDirectiveHook = (
  binding: DirectiveBinding,
  vnode: VNode
) => Data | undefined

export interface ObjectDirective<T = any> {
  beforeMount?: DirectiveHook<T, null>
  mounted?: DirectiveHook<T, null>
  beforeUpdate?: DirectiveHook<T, VNode<any, T>>
  updated?: DirectiveHook<T, VNode<any, T>>
  beforeUnmount?: DirectiveHook<T, null>
  unmounted?: DirectiveHook<T, null>
  getSSRProps?: SSRDirectiveHook
}

export type FunctionDirective<T = any> = DirectiveHook<T>

export type Directive<T = any> = ObjectDirective<T> | FunctionDirective<T>

export type DirectiveModifiers = Record<string, boolean>

export type VNodeDirectiveData = [
  unknown,
  string | undefined,
  DirectiveModifiers
]

const isBuiltInDirective = /*#__PURE__*/ makeMap(
  'bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text'
)

export function validateDirectiveName(name: string) {
  if (isBuiltInDirective(name)) {
    warn('Do not use built-in directive ids as custom directive id: ' + name)
  }
}

// Directive, value, argument, modifiers
export type DirectiveArguments = Array<
  | [Directive]
  | [Directive, any]
  | [Directive, any, string]
  | [Directive, any, string, DirectiveModifiers]
>

/**
 * Adds directives to a VNode.
 */
export function withDirectives<T extends VNode>(
  vnode: T,
  directives: DirectiveArguments
): T {
  const internalInstance = currentRenderingInstance
  if (internalInstance === null) {
    __DEV__ && warn(`withDirectives can only be used inside render functions.`)
    return vnode
  }
  const instance = internalInstance.proxy
  const bindings: DirectiveBinding[] = vnode.dirs || (vnode.dirs = [])
  for (let i = 0; i < directives.length; i++) {
    let [dir, value, arg, modifiers = EMPTY_OBJ] = directives[i]
    if (isFunction(dir)) {
      dir = {
        mounted: dir,
        updated: dir
      } as ObjectDirective
    }
    bindings.push({
      dir,
      instance,
      value,
      oldValue: void 0,
      arg,
      modifiers
    })
  }
  return vnode
}

export function invokeDirectiveHook(
  vnode: VNode,
  prevVNode: VNode | null,
  instance: ComponentInternalInstance | null,
  name: keyof ObjectDirective
) {
  const bindings = vnode.dirs!
  const oldBindings = prevVNode && prevVNode.dirs!
  for (let i = 0; i < bindings.length; i++) {
    const binding = bindings[i]
    if (oldBindings) {
      binding.oldValue = oldBindings[i].value
    }
    const hook = binding.dir[name] as DirectiveHook | undefined
    if (hook) {
      callWithAsyncErrorHandling(hook, instance, ErrorCodes.DIRECTIVE_HOOK, [
        vnode.el,
        binding,
        vnode,
        prevVNode
      ])
    }
  }
}
