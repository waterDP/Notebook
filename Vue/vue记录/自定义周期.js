import Vue from 'vue'

const notifyVisibilityChange = (lifeCycleName, vm) => {
  const lifeCycles = vm.$options[lifeCycleName]
  if (lifeCycles && lifeCycles.length) {
    lifeCycles.forEach(lifeCycle => lifeCycle.call(vm))
  }
  if (vm.$children && vm.$children.length) {
    vm.$children.forEach(child => notifyVisibilityChange(lifeCycleName, child))
  }
}

/**
 * 添加生命周期钩子函数
 */
export function init() {
  const optionsMergeStrategies = Vue.config.optionMergeStrategies
  optionsMergeStrategies.pageVisible = optionMergeStrategies.beforeCreate
  optionsMergeStrategies.pageHidden = optionMergeStrategies.created
}

/** 
 * 将事件绑定到根节点为上
 * @param {*} rootVm  
 */
export function bind(rootVm) {
  window.addEventListener('visibilityChange', () => {
    let lifeCycleName
    if (document.visibilityState === 'hidden') {
      lifeCycleName = 'pageHidden'
    } else if (document.visibilityState === 'visible') {
      lifeCycleName = 'pageVisible'
    }
    if (lifeCycleName) {
      notifyVisibleChange(lifeCycleName, rootVm)
    }
  })
}

// main.js
import {init, bind} from "./utils/custom-life-cycle"

init()

const vm = new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

bind(vm)