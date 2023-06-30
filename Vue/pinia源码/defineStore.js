import { SymbolPinia } from "./rootStore";
import { getCurrentInstance, inject, effectScope, reactive } from "vue";
/*
 * @Author: water.li
 * @Date: 2023-06-30 21:31:11
 * @Description:
 * @FilePath: \Notebook\Vue\pinia源码\defineStore.js
 */
export function defineStore(idOrOptions, setup) {
  let id;
  let options;
  if (typeof idOrOptions === "string") {
    id = idOrOptions;
    options = setup;
  } else {
    options = idOrOptions;
    id = options.id;
  }

  function useStore() {
    const currentInstance = getCurrentInstance();
    const pinia = currentInstance && inject(SymbolPinia);
    if (!pinia._s.has(id)) {
      createOptionsStore(id, options, pinia);
    }
    const store = pinia._s.get(id);
    return store;
  }
  return useStore();
}

function createOptionsStore(id, options, pinia) {
  let { state, getters, actions } = options;
  let scope;
  const store = reactive({});
  function setup() {
    pinia.state.value[id] = state ? state() : {};
    const localState = pinia.state.value[id];

    return localState;
  }

  const setupStore = pinia._e.run(() => {
    scope = effectScope();
    return scope.run(() => setup());
  });
  Object.assign(store, setupStore);
  pinia._s.set(id, store);
}
