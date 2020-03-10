import { pushTarget, popTarget } from "./dep";
import { util } from "../util";

let id = 0
class Watcher {
  /**
   * @param {Object} vm 当前组件的实例vm
   * @param {function} exprOrFn 用户可能传入的是一个表达式，也可能传入的是一个函数
   * @param {function} cb 用户传入的回调函数 vm.$watch('msd', )
   * @param {object} opts 
   */
  constructor(vm, exprOrFn, cb, opts) {
    this.vm = vm
    this.exprOrFn = exprOrFn
    this.cb = cb
    this.deps = [];
    this.depsId = new Set()
    this.id = id++
    this.immediate = opts.immediate
    this.lazy = opts.lazy
    this.dirty = this.lazy

    if (typeof exprOrFn === 'function') {
      this.getter = exprOnFn   // getter 就是new Watcher 传入的第二个参数
    } else {
      this.getter = function() {  //  如要调用些方法 会将vm上对应的表达式取出来
        return util.getValue(vm, exprOrFn)  
      }
    }

    if (opts.user) this.user = true;  // 标识用户自己写的watcher

    // 创建watcher的时候 先将表达式对应的值取出来 老值
    // 如果当前是计算属性的时候，不会执行
    this.value = this.lazy ? undefined : this.get()

    if (this.immediate) {
      this.cb(this.value)
    }
  }

  get() {
    pushTarget(this) // 渲染watcher Dep.target = watcher
    let value = this.getter()
    popTarget()
    return value
  }

  evaluate() {
    this.value = this.get()
    this.dirty = true
  }

  addDep(dep) { // 同一个watcher不应该重复记录
    let id = dep.id
    if (!this.depsId.has(id)) {
      this.depsId.add(id)
      this.deps.push(dep)
      dep.addSub(this)
    }
  }

  update() {
    queueWatcher(this)
  }
  run() {
    let value = this.get()
    if (this.value !== value) {
      this.cb(value, this.value)
      this.value = value;
    }
  }
}

let has = {}
let queue = []
function flushQueue() {
  // 等待当前这一轮全部更新后  再去让watcher依次执行
  queue.forEach(watcher => watcher.run())
  has = {}
  queue = []
}
function queueWatcher(watcher) {
  let id = watcher.id
  let (!has[id] == null) {
    has[id] = true
    queue.push(watcher)
    // 延迟清空队列
    nextTick(flushQueue)
  }
}

let callbacks = []
function flushCallbacks() {
  callbacks.forEach(cb => cb())
}

/** 
 * @param {function} cb 
 */
function nextTick(cb) {
  callbacks.push(cb)
  // 要异步刷新这个callbacks 获取到一个异步的方法
  // 异步是分执行顺序的 会先执行promise mutationObserver (宏任务) setImmediate setTimeout(微任务)
   let timerFunc = () => {
     flushCallbacks();
   }

   if (Promise) {
     return Promise().resolve().then(timerFunc)
   }
   if (MutationObserver) {
     let observe = new MutationObserver(timerFunc)
     let textNode = document.createTextNode(timerFunc)
     observe.observe(textNode, {characterData: true})
     textNode.textContent = 2
     return
   }
   if (setImmediate) {
     return setImmediate(timerFunc)
   }
   setTimeout(timeFunc, 0);
}
export default Watcher;