import {observe, set, del} from './observer'
import Dep from './observer/dep'
import {proxy, isObject, noop} from './util/index'
import Watcher from './observer/watcher'

// 此方法在init中调用
export function initState(vm) {
  const opts = vm.$options
  if (opts.props) {
    initProps(vm, opts.props)
  }
  if (opts.methods) {
    initMethods(vm, opts.methods)
  }
  if (opts.data) {
    initData(vm)
  }
  if (opts.computed) {
    initComputed(vm, opts.computed)
  }
  if (opts.watch) {
    initWatch(vm, opts.watch)
  }
}

function initProps(vm, props) {}

function initMethods(vm) {
  for (const key in methods) {
    vm[key] = typeof methods[key] !== 'function' ? noop : methods[key].bind(vm) 
  }
}

function initData(vm) {
  // 数据的初始化工作
  let data = vm.$options.data
  data = vm._data = typeof data === 'function' ? data.call(vm) : data
  for (let key in data) {
    proxy(vm, '_data', key) // 代理
  }
  observe(data)  // 对象劫持
}

function initComputed(vm, computed) {
  const watchers = vm._computedWatchers = {}
  for (let key in computed) {
    const userDef = computed[key]
    const getter = typeof userDef === 'function' ? userDef : userDef.get

    watchers[key] = new Watcher(vm, getter, noop, {lazy: true})

    defineComputed(vm, key, userDef)
  }
}

const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
}

function defineComputed(target, key, userDef) {
  // 这里需要添加缓存效果
  if (typeof userDef === 'function') {  
    sharedPropertyDefinition.get = createComputedGetter(key)
  } else {
    sharedPropertyDefinition.get = createComputedGetter(key)
    sharedPropertyDefinition.set = userDef.set || noop
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}

function createComputedGetter(key) {
  return function() { // 做缓存
    let watcher = this._computedWatchers[key] // this = vm
    if (watcher.dirty) { // 如果dirty为true, 就调用用户的方法
      watcher.evaluate()
    }
    if (Dep.target) { 
      // 计算属性出栈后 还要渲染watcher 我应该让计算属性watcher里面的属性也要收集上一层的watcher
      watcher.depend()
    }
    return watcher.value
  }
}

function initWatch(vm, watch) {
  for (let key in watch) {
    const handler = watch[key]
    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i])
      }
    } else {
      createWatcher(vm, key, handler)
    }
  }
}

/**
 * @param {object} vm
 * @param {string} key
 * @param {function} handler
 * @param {object} options
 */
function createWatcher(vm, key, handler, options) {
  if (isObject(handler)) {
    options = handler
    handler = handler.handler
  }
  if (typeof handler === 'string') { // 获取method中的方法替换掉handler
    handler = vm[handler]
  }
  return vm.$watch(key, handler, options)
}

export function stateMixin(Vue) {
  Vue.prototype.$set = set
  Vue.prototype.$del = del
  Vue.prototype.$watch = function(exprOrFn, cb, options) {
    const vm = this
    // ! 用户自己写的watcher
    options.user = true
    new Watcher(vm, exprOrFn, cb, options)
  }
}