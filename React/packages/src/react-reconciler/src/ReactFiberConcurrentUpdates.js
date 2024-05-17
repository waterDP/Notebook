/*
 * @Author: water.li
 * @Date: 2023-02-26 23:02:32
 * @Description:
 * @FilePath: \Notebook\React\packages\src\react-reconciler\src\ReactFiberConcurrentUpdates.js
 */
import { HostRoot } from "./ReactWorkTags";

const concurrentQueue = [];
let concurrentQueueIndex = 0;

export function finishQueueingConcurrentUpdates() {
  const endIndex = concurrentQueueIndex;
  concurrentQueueIndex = 0;
  let i = 0;
  while (i < endIndex) {
    const fiber = concurrentQueue[i++];
    const queue = concurrentQueue[i++];
    const update = concurrentQueue[i++];
    if (queue !== null && update !== null) {
      const pending = queue.pending;
      if (pending === null) {
        update.next = update;
      } else {
        update.next = pending.next;
        pending.next = update;
      }
      queue.pending = update;
    }
  }
}

/**
 * 把更新对象添加到更新队列中
 * @param {*} fiber 函数组件对应的fiber
 * @param {*} queue 要更新的hook对应的更新队列
 * @param {*} update 更新对象
 */
export function enqueueConcurrentHookUpdate(fiber, queue, update) {
  enqueueUpdate(fiber, queue, update);
  return getRootForUpdatedFiber(fiber);
}

function getRootForUpdatedFiber(sourceFiber) {
  let node = sourceFiber;
  let parent = node.return;
  while (parent !== null) {
    node = parent;
    parent = node.return;
  }
  return node.tag === HostRoot ? node.stateNode : null; // FiberRootNode div#root
}

/**
 * 把更新先缓到concurrentQueue数组中
 * @param {*} fiber
 * @param {*} queue
 * @param {*} update
 */
function enqueueUpdate(fiber, queue, update) {
  concurrentQueue[concurrentQueueIndex++] = fiber;
  concurrentQueue[concurrentQueueIndex++] = queue;
  concurrentQueue[concurrentQueueIndex++] = update;
}

export function markUpdateLaneFromFiberToRoot(soruceFiber) {
  let node = soruceFiber;
  let parent = soruceFiber.return;
  while (parent !== null) {
    node = parent;
    parent = parent.return;
  }
  if (node.tag === HostRoot) {
    return node.stateNode;
  }
  return null;
}
