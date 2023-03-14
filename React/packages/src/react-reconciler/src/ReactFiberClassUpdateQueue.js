/*
 * @Author: water.li
 * @Date: 2023-02-26 21:43:51
 * @Description:
 * @FilePath: \Notebook\React\source\src\react-reconciler\src\ReactFiberClassUpdateQueue.js
 */
import { markUpdateLaneFromFiberToRoot } from "./ReactFiberConcurrentUpdates";
import assign from "shared/assign";

export const UpdateState = 0;

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
  const update = {
    tag: UpdateState,
  };
  return update;
}

export function enqueueUpate(fiber, update) {
  const updateQueue = fiber.updateQueue;
  const pending = updateQueue.shared.pending;
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

/**
 * 根据老状态和更新队列中的更新计算最新的状态
 * @param {*} workInProgress 要计算的fiber
 */
export function processUpdateQueue(workInProgress) {
  const queue = workInProgress.updateQueue;
  const pendingQueue = queue.shared.pending;
  if (pendingQueue !== null) {
    // 如果有更新，或者说更新队列里有内容
    // 清除等待的更新
    queue.shared.pending = null;
    // 获取更新队列中最后一个更新 update : {payload: {element : 'h1'}}
    const lastPendingUpdate = pendingQueue;
    // 指向第一个更新
    const firstPendingUpdate = lastPendingUpdate.next;
    // 把更新链表剪开，变成一个单链表
    lastPendingUpdate.next = null;
    // 获取老状态
    let newState = workInProgress.memoizedState;
    let update = firstPendingUpdate;
    while (update) {
      // 根据老状态和更新计算新状态
      newState = getStateFromUpdate(update, newState);
      update = update.next;
    }
    // 把最终计算到的状态赋值给memoizedState
    workInProgress.memoizedState = newState;
  }
}

/**
 * 根据老状态计算新状态
 * @param {*} update 更新的对象其实有很多种类型
 * @param {*} prevState
 */
function getStateFromUpdate(update, prevState) {
  switch (update.tag) {
    case UpdateState:
      const { payload } = update;
      return assign({}, prevState, payload);
  }
}
