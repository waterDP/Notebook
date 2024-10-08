/*
 * @Author: water.li
 * @Date: 2023-06-30 21:30:50
 * @Description:
 * @FilePath: \Notebook\Vue\pinia源码\createPinia.js
 */
import { markRaw, effectScope, ref } from "vue";
import { SymbolPinia } from "./rootStore";
export let activePinia
export const setActivePinia = (pinia) => activePinia = pinia
export function createPinia() {
  const scope = effectScope(true);

  const state = scope.run(() => ref({}));

  const _p = []

  const pinia = markRaw({
    install(app) {
      pinia._a = app;
      setActivePinia(pinia)
      app.provide(SymbolPinia, pinia);
      app.config.globalProperties.$pinia = pinia;
    },
    _a: null,
    state,
    _e: scope, // 用来管理这个应用的effectScope
    _s: new Map(), // 记录所有的store
    use(plugin) {
      _p.push(plugin)
      return this
    },
    _p
  });

  return pinia;
}
