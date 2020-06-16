import {pushTarget, popTarget} from './dep'
import {queueWatcher} from './scheduler'

let id = 0

export default class Watcher {
  constructor(vm, exprOrFn, callback, options, isRenderWatcher) {
    this.vm = vm
    this.callback = callback
    this.options = options
    this.id = id++
    this.getter = exprOrFn // 将内部传过来的回调函数放到getter属性上
    this.depsId = new Set()
    this.deps = []
    this.get()
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
    this.getter() // 渲染watcher的执行
    popTarget()
  }
  update() {
    queueWatcher(this)
  }
  run() {
    this.get()
  }
}