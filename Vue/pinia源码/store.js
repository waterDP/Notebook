/*
 * @Author: water.li
 * @Date: 2023-06-30 21:31:11
 * @Description:
 * @FilePath: \Notebook\Vue\pinia源码\store.js
 */
import { SymbolPinia } from "./rootState";
import { getCurrentInstance, inject, effectScope, reactive, computed, toRefs, isRef, isReactive, watch } from "vue";
import { addSubscription, triggerSubscriptions } from "./subscribe"
import { activePinia, setActivePinia } from "./createPinia";

function isComputed(v) {
  return !!(isRef(v) && v.effect)
}

export function defineStore(idOrOptions, setup) {
  let id;
  let options;

  const isSetupStore = typeof setup === 'function'

  if (typeof idOrOptions === "string") {
    id = idOrOptions;
    options = setup;
  } else {
    options = idOrOptions;
    id = options.id;
  }

  function useStore() {
    const currentInstance = getCurrentInstance();
    let pinia = currentInstance && inject(SymbolPinia);
    if (pinia) {
      setActivePinia(pinia)
    }
    pinia = activePinia

    if (!pinia._s.has(id)) { // 没有创建过store
      if (isSetupStore) {
        createSetupStore(id, setup, pinia)
      } else {
        createOptionsStore(id, options, pinia);
      }
    }
    const store = pinia._s.get(id);
    return store;
  }
  return useStore();
}

function isObject(v) {
  return typeof v === 'object' && v !== null
}

function mergeReactiveObject(target, state) {
  for (let key in state) {
    let oldValue = target[key]
    let newValue = state[key]
    if (isObject(oldValue) && isObject(newValue)) {
      target[key] = mergeReactiveObject(oldValue, newValue)
    } else {
      target[key] = newValue
    }
  }
  return target
}

function createSetupStore(id, setup, pinia, isOption) {
  let scope

  function $patch(partialStateOrMutation) {
    if (typeof partialStateOrMutation === 'object') {
      mergeReactiveObject(pinia.state.value[id], partialStateOrMutation)
    } else {
      partialStateOrMutation(pinia.state.value[id])
    }
  }

  function $subscribe(callback, options = {}) {
    scope.run(() => watch(pinia.state.value[id], (state) => {
      callback({ storeId: id }, state)
    }), options)
  }


  let actionSubscriptions

  const partialState = {
    $patch,
    $subscribe,
    $onAction: addSubscription.bind(null, actionSubscriptions),
    $dispose() {
      scope.stop()
      actionSubscriptions = []
      pinia._s.delete(id)
    }
  }

  const store = reactive(partialState);

  const initialState = pinia.state.value[id]
  if (!initialState && !isOption) { //setup api
    pinia.state.value[id] = {}
  }

  const setupStore = pinia._e.run(() => {
    scope = effectScope();
    return scope.run(() => setup());
  });

  function wrapAction(action) {
    const afterCallbackList = []
    const onErrorCallbackList = []
    function after(callback) {
      afterCallbackList.push(callback)
    }

    function onError(callback) {
      onErrorCallbackList.push.push(callback)
    }

    return function () {
      triggerSubscriptions(actionSubscriptions, { after, onError })
      // 将actions中的this永远处理成store 保证this指向正确

      let ret
      try {
        ret = action.apply(store, arguments)
      } catch (e) {
        triggerSubscriptions(onErrorCallbackList, e)
      }
      if (ret instanceof Promise) {
        return ret.then((value) => {
          return triggerSubscriptions(afterCallbackList, value)
        }).catch(e => {
          triggerSubscriptions(onErrorCallbackList, e)
          return Promise.reject(e)
        })
      }

      triggerSubscriptions(afterCallbackList, ret)
      return ret
    }

  }


  for (let prop of setupStore) {
    const value = setupStore[prop]
    if (typeof value === 'function') {
      // 将函数的this永远指向store
      setupStore[prop] = wrapAction(value)
    }
    if ((isRef(prop) && !isComputed(props)) || isReactive(prop)) {
      if (!isOption) {
        pinia.state.value[id][key] = prop
      }
    }
  }

  Object.assign(store, setupStore);
  store.$id = id

  pinia._s.set(id, store);

  Object.defineProperty(store, '$state', {
    get: () => pinia.state.value[id],
    set: (state) => $patch($state => Object.assign($state, state))
  })

  pinia._p.forEach(plugin => {
    Object.assign(store, scope.run(() => plugin({ store })))
  })

  return store
}

function createOptionsStore(id, options, pinia) {
  let { state, actions, getters } = options;
  function setup() {
    // 用户提供的状态
    pinia.state.value[id] = state ? state() : {};
    const localState = toRefs(pinia.state.value[id]); // 保证解构出来依旧是响应式的

    return Object.assign(
      localState,
      actions, // 用户提供的动作
      Object.keys(getters).reduce((computeds, getterKey) => {
        computeds[getterKey] = computed(() => {
          return getters[getterKey].call(store)
        })
        return computeds
      }, {})
    )
  }

  const store = createSetupStore(id, setup, pinia, true)
  store.$reset = function () {
    const newState = state ? state() : {}
    store.$patch((state) => {
      Object.assign(state, newState)
    })
  }
}
