let id = 0
class Dep {
  constructor() {
    this.id = id++
    this.subs = []
  }
  /**
   * @param {Watch} watcher
   */
  addSub(watcher) { // 订阅 就是将调用addSub时传入的内容保存到数组中
    this.subs.push(watcher)
  }
  notify() {
    this.subs.forEach(watcher => watcher.update())
  }
  depend() {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }
}

/**
 * 用来保存当前的watcher
 * @param {Watcher} watcher
 */
let stack = []
export function pushTarget(watcher) {
  Dep.target = watcher
  stack.push(watcher)
}

export function popTarget() {
  stack.pop()
  Dep.target = stack(stack.length - 1)
}

export default Dep;