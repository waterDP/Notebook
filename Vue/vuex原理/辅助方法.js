import ModuleCollection from "./module/module-collection"

let Vue;
let forEach = (obj, callback) => {
  Object.keys(obj).forEach(key => {
    callback(obj[key], key)
  })
}

/** 
 * 安装模块 
 * @param rawModule {_raw, _children, state}
 */
function installModule(store, rootState, path, rawModule) {
  // ...
}

function getState(store, path) {
 // ...
}

class Store {
  // ...
}

// _Vue的构造函数
const install = (_Vue) => {
  Vue = _Vue;

  Vue.mixin({
    beforeCreate() {
      // 把父组件里的store属性，放到每个实例上
      if (this.options.store) {  // 根实例
        this.$store = this.$options.store
      } else {
        this.$store = this.$parent && this.$parent.store
      }
    }
  })
}

/** 
 * mapState
 */
export function mapState(stateArr) {
  let obj = {}
  stateArr.forEach(stateName => {
    obj[stateName] = function() {
      return this.$store.state[stateName]
    }
  })
  return obj
}

/**
 * mapGetters
 */
export function mapGetters(gettersArr) {
  let obj = {}
  gettersArr.forEach(getterName => {
    obj[getterName] = function() {
      return this.$store.getters[getterName]
    }
  })
}

/**
 * mapMutations
 */
export function mapMutations(obj) {
  let res = {}
  Object.entries(obj).forEach(([key,value]) => {
    res[key] = function(...args) {
      this.$store.commit(value, ...args)
    }
  })
  return res 
}

/**
 * mapActions
 */
export function mapMutations(obj) {
  let res = {}
  Object.entries(obj).forEach(([key,value]) => {
    res[key] = function(...args) {
      this.$store.dispatch(value, ...args)
    }
  })
  return res 
}

export default {
  Store,
  install
}