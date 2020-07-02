import ModuleCollection from "./module/module-collection"

let Vue;
let forEach = (obj, callback) => {
  Object.keys(obj).forEach(key => {
    callback(obj[key], key)
  })
}

/** 
 * 安装模块 
 * @param {array  } path
 * @param rawModule {_raw, _children, state}
 */
function installModule(store, rootState, path, rawModule) {

  if (path.length > 0) {  // 当前的path如果长度大于 0 说明有子模块 
    let parentState = path.slice(0, -1).reduce((root, current) => {
      return rootState[current]
    }, rootState)
    Vue.set(parentState, path[path.length - 1], rawModule.state)
  }

  // 根据当前用户传入的配置 算一下他需不需要增加一个前缀
  let root = store.module.root
  let namespace = path.reduce((str, current) => {
    root = root._children[current]
    str = str + (root._raw.namespaced ? current + '/' : '')
  }, '')
  let getters = rawModule._raw.getters
  // 定义getters
  if (getters) {
    forEach(getters, (getterName, getter) => {
      if (!store.getters[getterName]) {
        Object.defineProperty(store.getters, namespace+getterName, {
          get: () => {
            return getter(getState(store, path)) // 模块中的状态 
          }
        })
      }
    })
  }
  let mutations = rawModule._raw.mutations
  if (mutations) {
    forEach(mutations, (mutationName, mutation) => {
      let arr = store.mutations[namespace+mutationName] || (store.mutations[namespce+mutationName] = [])
      arr.push((payload) => {
        mutation(getState(store, path), payload) 
        store.subs.forEach(fn => fn({type: namespace+mutationName, payload: payload, store.state}))
      })
    })
  }
  let actions = rawModule._raw.actions
  if (actions) {
    forEach(actions, (actionName, action) => {
      let arr = store.actions[namespace+actionName] || (store.actions[namespace+actionName] = [])
      arr.push((payload) => {
        action(store, payload)
      })
    })
  }
  forEach(rawModule._children, (rawModule, moduleName) => {
    installModule(store, rootState, path.concat(moduleName), rawModule)
  })
}

function getState(store, path) {
  let local = path.reduce((newState, current) => {
    return newState[current]
  }, store.state)
  return local
}

class Store {
  constructor(options) {
    this.strict = options.strict || false;
    this._committing = false;
    // 获取用户new实例时传入的所有属性
    this.vm = new Vue({ // 创建vue的实例，保证状态一更新可以刷新视图 
      data: { // 默认这个状态 会被使用Object.defineProperty重新定义
        state: options.state
      }
    })

    this.getters = {}
    this.mutations = {};
    this.actions = {}
    this.subs = []

    // 我需要用户传入的数据进行格式化操作
    this.modules = new ModuleCollection(options);

    // 递归安装模块 store
    installModule(this, this.state, [], this.modules.root)

    let plugins = options.plugins
    plugins.forEach(plugin => plugin(this))

    // 监控是否采用同步的方式调用commit
    if (this.strict) {
      this.vm.$watch(() => {
        return this.vm.state
      }, function() {
        console.log(this._committing, '不能异步调用')
      }, {deep: true, sync: true}) // 深度监控 同步调用 
    }
  }
  _withCommit(fn) {
    const committing = this._committing
    this._committing = true;
    fn();
    this._committing = committing;
  }
  replaceState(newState) {
    this._withCommit(() => {
      this.vm.state = newState;  // 更新状态
    })
  }
  subscribe(fn) {
    this.subs.push(fn)
  }
  commit = (mutation, payload) => {  // es7的写法，这里面的this永远指向当前的store的实例
    this._withCommit(() => {  // 装饰 切片
      this.mutations[mutation].forEach(fn => fn(payload))
    })
  }
  dispatch = (actionName, payload) => {
    this.actions[actionName].forEach(fn => fn(payload))
  }
  get state() {  // 获取实例上的state属性就会执行此方法
    return this.vm.state
  }
  // 动态注册模块
  registerModule(moduleName, module) {
    if (!Array.isArray(moduleName)) {
      moduleName = [moduleName]
    }
    this._withCommit(() => {
      this.modules.registor(moduleName, module);
      // 将当前这个模块安装
      installModule(this, this.state, moduleName, module.rawModule)
    })
  }
}

// _Vue的构造函数
const install = (_Vue) => {
  Vue = _Vue;

  Vue.mixin({
    beforeCreate() {
      // 把父组件里的store属性，放到每个实例上
      if (this.$options.store) {  // 根实例
        this.$store = this.$options.store
      } else {
        this.$store = this.$parent && this.$parent.store
      }
    }
  })
}

export default {
  Store,
  install
}