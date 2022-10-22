/*
 * @Author: water.li
 * @Date: 2022-04-16 20:38:06
 * @Description: 
 * @FilePath: \note\Vue\vue源码\observer\scheduler.js
 */
import {nextTick} from '../util/next-tick'

let queue = []
let has = {}
let pending = false

function flushSchedulerQueue() {
  const flushQueue = queue.slice(0)
  flushQueue.forEach(watcher => watcher.run())
  queue = []
  has = {}
  pending = false
}

export function queueWatcher(watcher) {
  const id = watcher.id
  if (!has[id]) {
    queue.push(watcher)
    has[id] = true
    if (!pending) { // 批量更新
      nextTick(flushSchedulerQueue)
      pending = true
    }
  }
}