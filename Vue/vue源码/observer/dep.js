/*
 * @Author: water.li
 * @Date: 2022-04-16 20:38:06
 * @Description: 
 * @FilePath: \note\Vue\vue源码\observer\dep.js
 */
let id = 0

export default class Dep {
  constructor() {
    this.id = id++
    this.subs = [] // 存放当前属性对应的watcher有哪些
  }
  addSub(watcher) {
    this.subs.push(watcher)
  }
  depend() {
    // 观察者
    // 让这个watcher记住我当前这个dep
    Dep.target.addDep(this)
  }
  notify() {
    this.subs.forEach(watcher => watcher.update())
  }
}

const stack = []

export function pushTarget(watcher) {
  Dep.target = watcher
  stack.push(watcher)
}

export function popTarget() {
  stack.pop()
  Dep.target = stack[stack.length - 1]
}