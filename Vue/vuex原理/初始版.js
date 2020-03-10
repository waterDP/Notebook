let Vue;
let forEach = (obj, callback) => {
  Object.keys(obj).forEach(key => {
    callback(obj[key], key)
  })
}
class Store {
  constructor(options) {
    // 获取用户new实例时传入的所有属性
    this.vm = new Vue({ // 创建vue的实例，保证状态一更新可以刷新视图 
      data: { // 默认这个状态 会被使用Object.defineProperty重新定义
        state: options.state
      }
    })

    /**
     * @getter
     */
    let getters = options.getters // 获取用户传入的getters
    this.getters = {}

    forEach(getters, (getter, getterName) => {
      Object.defineProperty(this.getters, getterName, {
        get: () => {
          return getter(this.state)
        }
      })
    })

    /** 
     * @mutations 
     */
    // 把用户定义的mutation放到store上  
    let mutations = options.mutations;
    this.mutations = {};
    foreEach(mutations, (mutation, mutationName) => {
      this.mutations[mutationName] = (payload) => {
        mutation(this.state, payload)
        // ...
      }
    })

    /** 
     * @actions 
     */
    let actions = options.actions
    this.actions = {}
    // 最后我们会做一个监控 看一下是不是异步方法都在action中执行的
    forEach(actions, (action, actionName) => { 
      this.actions[actionName] = (payload) => {
        action[actionName](this, payload) 
      }
    })
  }
  commit = (mutation, payload) => {  // es7的写法，这里面的this永远指向当前的store的实例
    this.mutations[mutation](payload)
  }
  dispatch = (actionName, payload) => {
    this.actions[actionName](payload)  // 发布 
  }
  get state() {  // 获取实例上的state属性就会执行此方法
    return this.vm.state
  }
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

export default {
  Store,
  install
}