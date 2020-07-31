import {pushTarget, popTarget} from './dep'
import {queueWatcher} from './scheduler'

let id = 0

export default class Watcher {
  constructor(vm, exprOrFn, callback, options, isRenderWatcher) {
    this.vm = vm
    this.callback = callback
    this.options = options
    this.user = options.user
    this.sync = options.sync
    this.id = id++
    this.lazy = options.lazy
    this.dirty = this.lazy

    if (isRenderWatcher) {
      //todo 把当前的watcher赋值给当前组件的_watcher实例
      vm._watcher = this
    }

    if (typeof exprOrFn === 'function') {
      this.getter = exprOrFn // 将内部传过来的回调函数放到getter属性上
    } else {
      this.getter = function() {
        let path = exprOrFn.split('.')
        let val = vm
        for (let i = 0; i < path.length; i++) {
          val = val[path[i]]
        }
        return val
      }
    }
    this.depsId = new Set()
    this.deps = []
    this.value = this.lazy || this.get()
  }
  addDep(dep) { // watcher不能放重复的dep dep里不能放重复的watcher
    let id = dep.id
    if (!this.depsIs.has(id)) {
      this.depsId.add(id)
      this.deps = this.deps.push(dep)
      dep.addSub(this)
    }
  }
  get() {
    pushTarget(this)
    let value = this.getter.call(this.vm) // 渲染watcher的执行
    popTarget()

    return value
  }
  update() {
    if (this.sync) {
      this.run()
    } else if (this.lazy) {
      this.dirty = true
    } else {
      queueWatcher(this)
    }
  }
  evaluate() {
    this.value = this.get()
    this.dirty = false
  }
  run() {
    let oldValue = this.value
    let newValue = this.get()
    this.value = newValue
    if (this.user) {
      this.callback.call(vm, newValue, oldValue)
    }
  }
  depend() {
    let i = this.deps.length
    while(i--) {
      this.deps[i].depend()
    }
  }
}