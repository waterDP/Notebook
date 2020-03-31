import {Observer} from "./observer"
import Watcher from "./watcher"
import Dep from "./dep"


export function initState(vm) {
  // 做不同的初始化工作
  let options = vm.$options
  if (options.data) {
    initData(vm)
  }

  if (options.computed) {
    initComputed(vm)
  }

  if (options.watch) {
    initWatch(vm)
  }
}

export function observe(data) {
  if (typeof data !== 'object' || data == null) return
  if (data.__ob__) {  // 已经被监控过了
    return data.__ob__
  }
  return new Observer(data)
}

// 代理
function proxy(vm, source, key) {  // 代理数据vm.msg = vm._data.msg
  // vm.msg = 'hello'
  // vm._data.msg = 'hello'
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key]
    },
    set(newValue) {
      vm[source][key] = newValue
    }
  })
}

function initData(vm) { // 将用户插入的数据 通过object.defineProperty重新定义
  let data = vm.$options.data // 用户传入的data
  data = vm._data = typeof data === 'function' ? data.call(vm) : data || {}
  for (let key in data) {
    proxy(vm, '_data', key)  // 会将对vm上的取值操作和赋值操作代理给vm._data属性
  }
  observe(vm._data)  // 观察函数
}

function createComputedGetter (vm, key) {
  let watcher = vm._watchersComputed[key] // 这个watcher就是我们定义的计算属性的watcher
  return function() {
    if (watcher.dirty) { // 如果页面上取舍，页面dirty是true, 就会去调用watcher的get方法
      watcher.evaluate()
    }
    if (Dep.target) {
      watcher.depend()   // 加入渲染watcher
    }
    return watcher.value;
  }
}

function initComputed(vm) {
  let computed = vm.computed
  // 将计算属性的配置放在vm上
  let watchers = vm._watchersComputed = Object.create(null)

  for(let key in computed) {
    let userDef = computed[key];
    // new Watcher此时什么都不会做， 配置 lazy dirty
    watchers[key] = new Watcher(vm, userDef, () => {}, {lazy: true});

    Object.defineProperty(vm, key, {  // 将这个属性定义vm上
      get: createComputedGetter(vm, key)
    })
  }
}


/**
 * 创建watcher
 * @param {vm} vm
 * @param {string} key
 * @param {function | array} handler
 * @param {object} opts
 */
function createWatcher(vm, key, handler, opts) {
  return vm.$watch(key, handler, opts);
}

function initWatch(vm) {
  let watch = vm.$oopttions.watch // 获取用户传入的watch属性
  for (let key in watch) {
    let userDef = watcher[key]
    /* 
      vm.watch: {
        sub() {}
      }
    */
    let handler = userDef 
    if (userDef.handler) {
      /* 
        vm.watch: {
          sub: {
            handler() {

            },
            ...  immediate, deep
          }
        }
       */
      handler = userDep.handler
    }
    createWatcher(vm, key, handler, {immediate: userDef.immediate})
  }
}

