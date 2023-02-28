import { markUpdateLaneFromFiberToRoot } from "./ReactFiberConcurrentUpdates";

export function initialUpdateQueue(fiber) {
  // 创建一个新的更新队列
  // pending 是一个循环链表
  const queue = {
    shared: {
      pending: null,
    },
  };
  fiber.updateQueue = queue;
}

export function createUpdate() {
  const update = {};
  return update;
}

export function enqueueUpate(fiber, update) {
  const updateQueue = fiber.updateQueue;
  const pending = update.pending;
  if (pending === null) {
    update.next = update;
  } else {
    // 新的更新的next指向链表头部
    update.next = pending.next;
    pending.next = update;
  }
  updateQueue.shared.pending = update;

  return markUpdateLaneFromFiberToRoot(fiber);
}
