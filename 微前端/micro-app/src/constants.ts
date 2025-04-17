export enum ObservedAttrName {
  NAME = 'name',
  URL = 'url',
}

// app status
export enum appStates {
  CREATED = 'created',
  LOADING = 'loading',
  LOAD_FAILED = 'load_failed',
  BEFORE_MOUNT = 'before_mount',
  MOUNTING = 'mounting',
  MOUNTED = 'mounted',
  UNMOUNT = 'unmount',
}

// lifecycles
export enum lifeCycles {
  CREATED = 'created',
  BEFOREMOUNT = 'beforemount',
  MOUNTED = 'mounted',
  UNMOUNT = 'unmount',
  ERROR = 'error',
  // 👇 keep-alive only
  BEFORESHOW = 'beforeshow',
  AFTERSHOW = 'aftershow',
  AFTERHIDDEN = 'afterhidden',
}

// global event of child app
export enum microGlobalEvent {
  ONMOUNT = 'onmount',
  ONUNMOUNT = 'onunmount',
}

// keep-alive status
export enum keepAliveStates {
  KEEP_ALIVE_SHOW = 'keep_alive_show',
  KEEP_ALIVE_HIDDEN = 'keep_alive_hidden',
}

// micro-app config
export enum MicroAppConfig {
  DESTROY = 'destroy',
  DESTORY = 'destory',
  INLINE = 'inline',
  DISABLESCOPECSS = 'disableScopecss',
  DISABLESANDBOX = 'disableSandbox',
  DISABLE_SCOPECSS = 'disable-scopecss',
  DISABLE_SANDBOX = 'disable-sandbox',
  DISABLE_MEMORY_ROUTER = 'disable-memory-router',
  DISABLE_PATCH_REQUEST = 'disable-patch-request',
  KEEP_ROUTER_STATE = 'keep-router-state',
  KEEP_ALIVE = 'keep-alive',
  CLEAR_DATA ='clear-data',
  SSR = 'ssr',
  FIBER = 'fiber',
}

/**
 * global key must be static key, they can not rewrite
 * e.g.
 * window.Promise = newValue
 * new Promise ==> still get old value, not newValue, because they are cached by top function
 * NOTE:
 * 1. Do not add fetch, XMLHttpRequest, EventSource
 */
export const GLOBAL_CACHED_KEY = 'window,self,globalThis,document,Document,Array,Object,String,Boolean,Math,Number,Symbol,Date,Function,Proxy,WeakMap,WeakSet,Set,Map,Reflect,Element,Node,RegExp,Error,TypeError,JSON,isNaN,parseFloat,parseInt,performance,console,decodeURI,encodeURI,decodeURIComponent,encodeURIComponent,navigator,undefined,location,history'

// prefetch level
export const PREFETCH_LEVEL: number[] = [1, 2, 3]

/**
 * memory router modes
 * NOTE:
 *  1. The only difference between native and native-scope is location.origin, in native-scope mode location.origin point to child app
 *  2. native mode equal to disable-memory-router
*/
// 临时注释，1.0版本放开，默认模式切换为state
// // default mode, sync child app router info to history.state
// export const DEFAULT_ROUTER_MODE = 'state'
// // sync child app router info to browser url as search
// export const ROUTER_MODE_SEARCH = 'search'

// 临时放开，1.0版本去除
export const ROUTER_MODE_STATE = 'state'
export const DEFAULT_ROUTER_MODE = 'search'

// render base on browser url, and location.origin location.href point to base app
export const ROUTER_MODE_NATIVE = 'native'
// render base on browser url, but location.origin location.href point to child app
export const ROUTER_MODE_NATIVE_SCOPE = 'native-scope'
// search mode, but child router info will not sync to browser url
export const ROUTER_MODE_PURE = 'pure'
export const ROUTER_MODE_LIST: string[] = [
  DEFAULT_ROUTER_MODE,
  ROUTER_MODE_STATE,
  ROUTER_MODE_NATIVE,
  ROUTER_MODE_NATIVE_SCOPE,
  ROUTER_MODE_PURE,
]

// event bound to child app window
const BASE_SCOPE_WINDOW_EVENT = [
  'popstate',
  'hashchange',
  'load',
  'unload',
  'unmount',
  'appstate-change',
  'statechange',
  'mounted',
  'error'
  // 'beforeunload', // remove at 2024.5.30 by cangdu
]

// bind event of with sandbox
export const SCOPE_WINDOW_EVENT_OF_WITH = BASE_SCOPE_WINDOW_EVENT

// bind event of iframe sandbox
export const SCOPE_WINDOW_EVENT_OF_IFRAME = BASE_SCOPE_WINDOW_EVENT.concat([
  'unhandledrejection',
  'message'
])

// on event bound to child app window
// TODO: with和iframe处理方式不同，需修改
const BASE_SCOPE_WINDOW_ON_EVENT = [
  'onpopstate',
  'onhashchange',
  'onload',
  'onunload',
  'onerror'
  // 'onbeforeunload', // remove at 2024.5.30 by cangdu
]

// bind on event of with sandbox
export const SCOPE_WINDOW_ON_EVENT_OF_WITH = BASE_SCOPE_WINDOW_ON_EVENT

// bind on event of iframe sandbox
export const SCOPE_WINDOW_ON_EVENT_OF_IFRAME = BASE_SCOPE_WINDOW_ON_EVENT.concat([
  'onunhandledrejection',
])

// event bound to child app document
export const SCOPE_DOCUMENT_EVENT = [
  'DOMContentLoaded',
  'readystatechange',
]

// on event bound to child app document
export const SCOPE_DOCUMENT_ON_EVENT = [
  'onreadystatechange',
]

// global key point to window
export const GLOBAL_KEY_TO_WINDOW: Array<PropertyKey> = [
  'window',
  'self',
  'globalThis',
]

export const RAW_GLOBAL_TARGET: Array<PropertyKey> = ['rawWindow', 'rawDocument']

export const HIJACK_LOCATION_KEYS = [
  'host',
  'hostname',
  'port',
  'protocol',
  'origin',
]
