import {
  VNode,
  VNodeProps,
  createVNode,
  VNodeArrayChildren,
  Fragment,
  isVNode
} from './vnode'
import { Teleport, TeleportProps } from './components/Teleport'
import { Suspense, SuspenseProps } from './components/Suspense'
import { isObject, isArray } from '@vue/shared'
import { RawSlots } from './componentSlots'
import { FunctionalComponent, Component } from './component'
import { ComponentOptions } from './componentOptions'

// `h` is a more user-friendly version of `createVNode` that allows omitting the
// props when possible. It is intended for manually written render functions.
// Compiler-generated code uses `createVNode` because
// 1. it is monomorphic and avoids the extra call overhead
// 2. it allows specifying patchFlags for optimization

/*
// type only
h('div')

// type + props
h('div', {})

// type + omit props + children
// Omit props does NOT support named slots
h('div', []) // array
h('div', 'foo') // text
h('div', h('br')) // vnode
h(Component, () => {}) // default slot

// type + props + children
h('div', {}, []) // array
h('div', {}, 'foo') // text
h('div', {}, h('br')) // vnode
h(Component, {}, () => {}) // default slot
h(Component, {}, {}) // named slots

// named slots without props requires explicit `null` to avoid ambiguity
h(Component, null, {})
**/

type RawProps = VNodeProps & {
  // used to differ from a single VNode object as children
  __v_isVNode?: never
  // used to differ from Array children
  [Symbol.iterator]?: never
}

type RawChildren =
  | string
  | number
  | boolean
  | VNode
  | VNodeArrayChildren
  | (() => any)

// fake constructor type returned from `defineComponent`
interface Constructor<P = any> {
  __isFragment?: never
  __isTeleport?: never
  __isSuspense?: never
  new (): { $props: P }
}

// Excludes Component type from returned `defineComponent`
type NotDefinedComponent<T extends Component> = T extends Constructor
  ? never
  : T

// The following is a series of overloads for providing props validation of
// manually written render functions.

// element
export function h(type: string, children?: RawChildren): VNode
export function h(
  type: string,
  props?: RawProps | null,
  children?: RawChildren
): VNode

// fragment
export function h(type: typeof Fragment, children?: VNodeArrayChildren): VNode
export function h(
  type: typeof Fragment,
  props?: RawProps | null,
  children?: VNodeArrayChildren
): VNode

// teleport (target prop is required)
export function h(
  type: typeof Teleport,
  props: RawProps & TeleportProps,
  children: RawChildren
): VNode

// suspense
export function h(type: typeof Suspense, children?: RawChildren): VNode
export function h(
  type: typeof Suspense,
  props?: (RawProps & SuspenseProps) | null,
  children?: RawChildren | RawSlots
): VNode

// functional component
export function h<P>(
  type: FunctionalComponent<P>,
  props?: (RawProps & P) | ({} extends P ? null : never),
  children?: RawChildren | RawSlots
): VNode

// catch-all for generic component types
export function h(type: Component, children?: RawChildren): VNode

// exclude `defineComponent`
export function h<Options extends ComponentOptions | FunctionalComponent<{}>>(
  type: NotDefinedComponent<Options>,
  props?: RawProps | null,
  children?: RawChildren | RawSlots
): VNode

// fake constructor type returned by `defineComponent` or class component
export function h(type: Constructor, children?: RawChildren): VNode
export function h<P>(
  type: Constructor<P>,
  props?: (RawProps & P) | ({} extends P ? null : never),
  children?: RawChildren | RawSlots
): VNode

// Actual implementation
export function h(type: any, propsOrChildren?: any, children?: any): VNode {
  if (arguments.length === 2) {
    if (isObject(propsOrChildren) && !isArray(propsOrChildren)) {
      // single vnode without props
      if (isVNode(propsOrChildren)) {
        return createVNode(type, null, [propsOrChildren])
      }
      // props without children
      return createVNode(type, propsOrChildren)
    } else {
      // omit props
      return createVNode(type, null, propsOrChildren)
    }
  } else {
    if (isVNode(children)) {
      children = [children]
    }
    return createVNode(type, propsOrChildren, children)
  }
}
