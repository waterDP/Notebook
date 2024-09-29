/*
 * @Author: water.li
 * @Date: 2023-06-30 21:30:50
 * @Description:
 * @FilePath: \Notebook\Vue\pinia源码\createPinia.js
 */
import { markRaw, effectScope, ref } from "vue";
import { SymbolPinia } from "./rootState";

export function createPinia() {
  const scope = effectScope(true);

  const state = scope.run(() => ref({}));

  const pinia = markRaw({
    install(app) {
      pinia._a = app;
      app.provide(SymbolPinia, pinia);
      app.globalProperties.$pinia = pinia;
    },
    _a: null,
    state,
    _e: scope, // 用来管理这个应用的effectScope
    _s: new Map(), // 记录所有的store
  });

  return pinia;
}
