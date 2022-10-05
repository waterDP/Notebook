/*
 * @Author: water.li
 * @Date: 2022-04-16 20:38:06
 * @Description: 
 * @FilePath: \note\Vue\vue源码\observer\scheduler.js
 */
import {nextTick} from '../util/next-tick'

let queue = []
let has = {}

function flushSchedulerQueue() {
  const flushQueue = queue.slice(0)
  queue = []
  has = {}
  flushQueue.forEach(watcher => watcher.run)
}

export function queueWatcher(watcher) {
  const id = watcher.id
  if (!has[id]) {
    queue.push(watcher)
    has[id] = true
    nextTick(flushSchedulerQueue)
  }
}