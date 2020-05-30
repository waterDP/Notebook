import { VNode, VNodeChild, isVNode } from './vnode'
import {
  reactive,
  ReactiveEffect,
  pauseTracking,
  resetTracking,
  shallowReadonly
} from '@vue/reactivity'
import {
  ComponentPublicInstance,
  PublicInstanceProxyHandlers,
  RuntimeCompiledPublicInstanceProxyHandlers,
  createRenderContext,
  exposePropsOnRenderContext,
  exposeSetupStateOnRenderContext
} from './componentProxy'
import { ComponentPropsOptions, initProps } from './componentProps'
import { Slots, initSlots, InternalSlots } from './componentSlots'
import { warn } from './warning'
import { ErrorCodes, callWithErrorHandling } from './errorHandling'
import { AppContext, createAppContext, AppConfig } from './apiCreateApp'
import { Directive, validateDirectiveName } from './directives'
import { applyOptions, ComponentOptions } from './componentOptions'
import {
  EmitsOptions,
  ObjectEmitsOptions,
  EmitFn,
  emit
} from './componentEmits'
import {
  EMPTY_OBJ,
  isFunction,
  NOOP,
  isObject,
  NO,
  makeMap,
  isPromise,
  ShapeFlags
} from '@vue/shared'
import { SuspenseBoundary } from './components/Suspense'
import { CompilerOptions } from '@vue/compiler-core'
import {
  currentRenderingInstance,
  markAttrsAccessed
} from './componentRenderUtils'
import { startMeasure, endMeasure } from './profiling'

export type Data = { [key: string]: unknown }

// Note: can't mark this whole interface internal because some public interfaces
// extend it.
export interface SFCInternalOptions {
  /**
   * @internal
   */
  __scopeId?: string
  /**
   * @internal
   */
  __cssModules?: Data
  /**
   * @internal
   */
  __hmrId?: string
  /**
   * @internal
   */
  __hmrUpdated?: boolean
  /**
   * This one should be exposed so that devtools can make use of it
   */
  __file?: string
}

export interface FunctionalComponent<
  P = {},
  E extends EmitsOptions = Record<string, any>
> extends SFCInternalOptions {
  // use of any here is intentional so it can be a valid JSX Element constructor
  (props: P, ctx: SetupContext<E>): any
  props?: ComponentPropsOptions<P>
  emits?: E | (keyof E)[]
  inheritAttrs?: boolean
  inheritRef?: boolean
  displayName?: string
}

export interface ClassComponent {
  new (...args: any[]): ComponentPublicInstance<any, any, any, any, any>
  __vccOpts: ComponentOptions
}

export type Component = ComponentOptions | FunctionalComponent<any>

// A type used in public APIs where a component type is expected.
// The constructor type is an artificial type returned by defineComponent().
export type PublicAPIComponent =
  | Component
  | { new (...args: any[]): ComponentPublicInstance<any, any, any, any, any> }

export { ComponentOptions }

type LifecycleHook = Function[] | null

export const enum LifecycleHooks {
  BEFORE_CREATE = 'bc',
  CREATED = 'c',
  BEFORE_MOUNT = 'bm',
  MOUNTED = 'm',
  BEFORE_UPDATE = 'bu',
  UPDATED = 'u',
  BEFORE_UNMOUNT = 'bum',
  UNMOUNTED = 'um',
  DEACTIVATED = 'da',
  ACTIVATED = 'a',
  RENDER_TRIGGERED = 'rtg',
  RENDER_TRACKED = 'rtc',
  ERROR_CAPTURED = 'ec'
}

export interface SetupContext<E = ObjectEmitsOptions> {
  attrs: Data
  slots: Slots
  emit: EmitFn<E>
}

/**
 * @internal
 */
export type InternalRenderFunction = {
  (
    ctx: ComponentPublicInstance,
    cache: ComponentInternalInstance['renderCache']
  ): VNodeChild
  _rc?: boolean // isRuntimeCompiled
}

/**
 * We expose a subset of properties on the internal instance as they are
 * useful for advanced external libraries and tools.
 */
export interface ComponentInternalInstance {
  uid: number
  type: Component
  parent: ComponentInternalInstance | null
  root: ComponentInternalInstance
  appContext: AppContext
  /**
   * Vnode representing this component in its parent's vdom tree
   */
  vnode: VNode
  /**
   * The pending new vnode from parent updates
   * @internal
   */
  next: VNode | null
  /**
   * Root vnode of this component's own vdom tree
   */
  subTree: VNode
  /**
   * The reactive effect for rendering and patching the component. Callable.
   */
  update: ReactiveEffect
  /**
   * The render function that returns vdom tree.
   * @internal
   */
  render: InternalRenderFunction | null
  /**
   * Object containing values this component provides for its descendents
   * @internal
   */
  provides: Data
  /**
   * Tracking reactive effects (e.g. watchers) associated with this component
   * so that they can be automatically stopped on component unmount
   * @internal
   */
  effects: ReactiveEffect[] | null
  /**
   * cache for proxy access type to avoid hasOwnProperty calls
   * @internal
   */
  accessCache: Data | null
  /**
   * cache for render function values that rely on _ctx but won't need updates
   * after initialized (e.g. inline handlers)
   * @internal
   */
  renderCache: (Function | VNode)[]

  /**
   * Asset hashes that prototypally inherits app-level asset hashes for fast
   * resolution
   * @internal
   */
  components: Record<string, Component>
  /**
   * @internal
   */
  directives: Record<string, Directive>

  // the rest are only for stateful components ---------------------------------

  // main proxy that serves as the public instance (`this`)
  proxy: ComponentPublicInstance | null

  /**
   * alternative proxy used only for runtime-compiled render functions using
   * `with` block
   * @internal
   */
  withProxy: ComponentPublicInstance | null
  /**
   * This is the target for the public instance proxy. It also holds properties
   * injected by user options (computed, methods etc.) and user-attached
   * custom properties (via `this.x = ...`)
   * @internal
   */
  ctx: Data

  // internal state
  data: Data
  props: Data
  attrs: Data
  slots: InternalSlots
  refs: Data
  emit: EmitFn

  /**
   * setup related
   * @internal
   */
  setupState: Data
  /**
   * @internal
   */
  setupContext: SetupContext | null

  /**
   * suspense related
   * @internal
   */
  suspense: SuspenseBoundary | null
  /**
   * @internal
   */
  asyncDep: Promise<any> | null
  /**
   * @internal
   */
  asyncResolved: boolean

  // lifecycle
  isMounted: boolean
  isUnmounted: boolean
  isDeactivated: boolean
  /**
   * @internal
   */
  [LifecycleHooks.BEFORE_CREATE]: LifecycleHook
  /**
   * @internal
   */
  [LifecycleHooks.CREATED]: LifecycleHook
  /**
   * @internal
   */
  [LifecycleHooks.BEFORE_MOUNT]: LifecycleHook
  /**
   * @internal
   */
  [LifecycleHooks.MOUNTED]: LifecycleHook
  /**
   * @internal
   */
  [LifecycleHooks.BEFORE_UPDATE]: LifecycleHook
  /**
   * @internal
   */
  [LifecycleHooks.UPDATED]: LifecycleHook
  /**
   * @internal
   */
  [LifecycleHooks.BEFORE_UNMOUNT]: LifecycleHook
  /**
   * @internal
   */
  [LifecycleHooks.UNMOUNTED]: LifecycleHook
  /**
   * @internal
   */
  [LifecycleHooks.RENDER_TRACKED]: LifecycleHook
  /**
   * @internal
   */
  [LifecycleHooks.RENDER_TRIGGERED]: LifecycleHook
  /**
   * @internal
   */
  [LifecycleHooks.ACTIVATED]: LifecycleHook
  /**
   * @internal
   */
  [LifecycleHooks.DEACTIVATED]: LifecycleHook
  /**
   * @internal
   */
  [LifecycleHooks.ERROR_CAPTURED]: LifecycleHook

  /**
   * hmr marker (dev only)
   * @internal
   */
  hmrUpdated?: boolean
}

const emptyAppContext = createAppContext()

let uid = 0

export function createComponentInstance(
  vnode: VNode,
  parent: ComponentInternalInstance | null,
  suspense: SuspenseBoundary | null
) {
  // inherit parent app context - or - if root, adopt from root vnode
  const appContext =
    (parent ? parent.appContext : vnode.appContext) || emptyAppContext
  const instance: ComponentInternalInstance = {
    uid: uid++,
    vnode,
    parent,
    appContext,
    type: vnode.type as Component,
    root: null!, // to be immediately set
    next: null,
    subTree: null!, // will be set synchronously right after creation
    update: null!, // will be set synchronously right after creation
    render: null,
    proxy: null,
    withProxy: null,
    effects: null,
    provides: parent ? parent.provides : Object.create(appContext.provides),
    accessCache: null!,
    renderCache: [],

    // state
    ctx: EMPTY_OBJ,
    data: EMPTY_OBJ,
    props: EMPTY_OBJ,
    attrs: EMPTY_OBJ,
    slots: EMPTY_OBJ,
    refs: EMPTY_OBJ,
    setupState: EMPTY_OBJ,
    setupContext: null,

    // per-instance asset storage (mutable during options resolution)
    components: Object.create(appContext.components),
    directives: Object.create(appContext.directives),

    // suspense related
    suspense,
    asyncDep: null,
    asyncResolved: false,

    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: false,
    isUnmounted: false,
    isDeactivated: false,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    emit: null as any // to be set immediately
  }
  if (__DEV__) {
    instance.ctx = createRenderContext(instance)
  } else {
    instance.ctx = { _: instance }
  }
  instance.root = parent ? parent.root : instance
  instance.emit = emit.bind(null, instance)
  return instance
}

export let currentInstance: ComponentInternalInstance | null = null

export const getCurrentInstance: () => ComponentInternalInstance | null = () =>
  currentInstance || currentRenderingInstance

export const setCurrentInstance = (
  instance: ComponentInternalInstance | null
) => {
  currentInstance = instance
}

const isBuiltInTag = /*#__PURE__*/ makeMap('slot,component')

export function validateComponentName(name: string, config: AppConfig) {
  const appIsNativeTag = config.isNativeTag || NO
  if (isBuiltInTag(name) || appIsNativeTag(name)) {
    warn(
      'Do not use built-in or reserved HTML elements as component id: ' + name
    )
  }
}

export let isInSSRComponentSetup = false

export function setupComponent(
  instance: ComponentInternalInstance,
  isSSR = false
) {
  isInSSRComponentSetup = isSSR

  const { props, children, shapeFlag } = instance.vnode
  const isStateful = shapeFlag & ShapeFlags.STATEFUL_COMPONENT
  initProps(instance, props, isStateful, isSSR)
  initSlots(instance, children)

  const setupResult = isStateful
    ? setupStatefulComponent(instance, isSSR)
    : undefined
  isInSSRComponentSetup = false
  return setupResult
}

function setupStatefulComponent(
  instance: ComponentInternalInstance,
  isSSR: boolean
) {
  const Component = instance.type as ComponentOptions

  if (__DEV__) {
    if (Component.name) {
      validateComponentName(Component.name, instance.appContext.config)
    }
    if (Component.components) {
      const names = Object.keys(Component.components)
      for (let i = 0; i < names.length; i++) {
        validateComponentName(names[i], instance.appContext.config)
      }
    }
    if (Component.directives) {
      const names = Object.keys(Component.directives)
      for (let i = 0; i < names.length; i++) {
        validateDirectiveName(names[i])
      }
    }
  }
  // 0. create render proxy property access cache
  instance.accessCache = {}
  // 1. create public instance / render proxy
  // also mark it raw so it's never observed
  instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers)
  if (__DEV__) {
    exposePropsOnRenderContext(instance)
  }
  // 2. call setup()
  const { setup } = Component
  if (setup) {
    const setupContext = (instance.setupContext =
      setup.length > 1 ? createSetupContext(instance) : null)

    currentInstance = instance
    pauseTracking()
    const setupResult = callWithErrorHandling(
      setup,
      instance,
      ErrorCodes.SETUP_FUNCTION,
      [__DEV__ ? shallowReadonly(instance.props) : instance.props, setupContext]
    )
    resetTracking()
    currentInstance = null

    if (isPromise(setupResult)) {
      if (isSSR) {
        // return the promise so server-renderer can wait on it
        return setupResult.then((resolvedResult: unknown) => {
          handleSetupResult(instance, resolvedResult, isSSR)
        })
      } else if (__FEATURE_SUSPENSE__) {
        // async setup returned Promise.
        // bail here and wait for re-entry.
        instance.asyncDep = setupResult
      } else if (__DEV__) {
        warn(
          `setup() returned a Promise, but the version of Vue you are using ` +
            `does not support it yet.`
        )
      }
    } else {
      handleSetupResult(instance, setupResult, isSSR)
    }
  } else {
    finishComponentSetup(instance, isSSR)
  }
}

export function handleSetupResult(
  instance: ComponentInternalInstance,
  setupResult: unknown,
  isSSR: boolean
) {
  if (isFunction(setupResult)) {
    // setup returned an inline render function
    instance.render = setupResult as InternalRenderFunction
  } else if (isObject(setupResult)) {
    if (__DEV__ && isVNode(setupResult)) {
      warn(
        `setup() should not return VNodes directly - ` +
          `return a render function instead.`
      )
    }
    // setup returned bindings.
    // assuming a render function compiled from template is present.
    instance.setupState = reactive(setupResult)
    if (__DEV__) {
      exposeSetupStateOnRenderContext(instance)
    }
  } else if (__DEV__ && setupResult !== undefined) {
    warn(
      `setup() should return an object. Received: ${
        setupResult === null ? 'null' : typeof setupResult
      }`
    )
  }
  finishComponentSetup(instance, isSSR)
}

type CompileFunction = (
  template: string | object,
  options?: CompilerOptions
) => InternalRenderFunction

let compile: CompileFunction | undefined

/**
 * For runtime-dom to register the compiler.
 * Note the exported method uses any to avoid d.ts relying on the compiler types.
 */
export function registerRuntimeCompiler(_compile: any) {
  compile = _compile
}

function finishComponentSetup(
  instance: ComponentInternalInstance,
  isSSR: boolean
) {
  const Component = instance.type as ComponentOptions

  // template / render function normalization
  if (__NODE_JS__ && isSSR) {
    if (Component.render) {
      instance.render = Component.render as InternalRenderFunction
    }
  } else if (!instance.render) {
    if (compile && Component.template && !Component.render) {
      if (__DEV__) {
        startMeasure(instance, `compile`)
      }
      Component.render = compile(Component.template, {
        isCustomElement: instance.appContext.config.isCustomElement || NO
      })
      if (__DEV__) {
        endMeasure(instance, `compile`)
      }
      // mark the function as runtime compiled
      ;(Component.render as InternalRenderFunction)._rc = true
    }

    if (__DEV__ && !Component.render) {
      /* istanbul ignore if */
      if (!compile && Component.template) {
        warn(
          `Component provided template option but ` +
            `runtime compilation is not supported in this build of Vue.` +
            (__ESM_BUNDLER__
              ? ` Configure your bundler to alias "vue" to "vue/dist/vue.esm-bundler.js".`
              : __ESM_BROWSER__
                ? ` Use "vue.esm-browser.js" instead.`
                : __GLOBAL__
                  ? ` Use "vue.global.js" instead.`
                  : ``) /* should not happen */
        )
      } else {
        warn(`Component is missing template or render function.`)
      }
    }

    instance.render = (Component.render || NOOP) as InternalRenderFunction

    // for runtime-compiled render functions using `with` blocks, the render
    // proxy used needs a different `has` handler which is more performant and
    // also only allows a whitelist of globals to fallthrough.
    if (instance.render._rc) {
      instance.withProxy = new Proxy(
        instance.ctx,
        RuntimeCompiledPublicInstanceProxyHandlers
      )
    }
  }

  // support for 2.x options
  if (__FEATURE_OPTIONS__) {
    currentInstance = instance
    applyOptions(instance, Component)
    currentInstance = null
  }
}

const attrHandlers: ProxyHandler<Data> = {
  get: (target, key: string) => {
    if (__DEV__) {
      markAttrsAccessed()
    }
    return target[key]
  },
  set: () => {
    warn(`setupContext.attrs is readonly.`)
    return false
  },
  deleteProperty: () => {
    warn(`setupContext.attrs is readonly.`)
    return false
  }
}

function createSetupContext(instance: ComponentInternalInstance): SetupContext {
  if (__DEV__) {
    // We use getters in dev in case libs like test-utils overwrite instance
    // properties (overwrites should not be done in prod)
    return Object.freeze({
      get attrs() {
        return new Proxy(instance.attrs, attrHandlers)
      },
      get slots() {
        return shallowReadonly(instance.slots)
      },
      get emit() {
        return (event: string, ...args: any[]) => instance.emit(event, ...args)
      }
    })
  } else {
    return {
      attrs: instance.attrs,
      slots: instance.slots,
      emit: instance.emit
    }
  }
}

// record effects created during a component's setup() so that they can be
// stopped when the component unmounts
export function recordInstanceBoundEffect(effect: ReactiveEffect) {
  if (currentInstance) {
    ;(currentInstance.effects || (currentInstance.effects = [])).push(effect)
  }
}

const classifyRE = /(?:^|[-_])(\w)/g
const classify = (str: string): string =>
  str.replace(classifyRE, c => c.toUpperCase()).replace(/[-_]/g, '')

export function formatComponentName(
  Component: Component,
  isRoot = false
): string {
  let name = isFunction(Component)
    ? Component.displayName || Component.name
    : Component.name
  if (!name && Component.__file) {
    const match = Component.__file.match(/([^/\\]+)\.vue$/)
    if (match) {
      name = match[1]
    }
  }
  return name ? classify(name) : isRoot ? `App` : `Anonymous`
}
