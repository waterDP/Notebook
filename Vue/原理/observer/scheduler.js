import {nextTick} from '../util/next-tick'

let queue = []
let has = {}

function flushSchedulerQueue() {
  queue.forEach(watcher => watcher.run())
  queue = []
  has = {}
}

export function queueWatcher(watcher) {
  const id = watcher.id
  if (has[id] === undefined) {
    queue.push(watcher)
    has[id] = true
    nextTick(flushSchedulerQueue)
  }
}