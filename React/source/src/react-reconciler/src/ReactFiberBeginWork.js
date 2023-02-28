/*
 * @Author: water.li
 * @Date: 2023-02-28 22:41:05
 * @Description:
 * @FilePath: \Notebook\React\source\src\react-reconciler\src\ReactFiberBeginWork.js
 */

import logger from "shared/logger";
import { HostComponent, HostRoot, HostText } from "./ReactWorkTags";

function updateHostRoot(current, workInProgress) {
  // 子vdom
  processUpdateQueue(workInProgress); // workInProgress.memoizedState = {element}
  const nextState = workInProgress.memorizedState;
  const nextChildren = nextState.element;
  // ! 协调了节点 DOM-DIFF算法
  reconcileChildren(current, workInProgress, nextChildren);
  return workInProgress.child; // {tag: 5, type: 'h1'}
}

function updateHostComponent(current, workInProgress) {}

/**
 * 目标是根据vdom构建新的fiber子链表
 * @param {*} current 老fiber
 * @param {*} workInProgress 新fiber
 */
export function beginWork(current, workInProgress) {
  logger("beginWork", workInProgress);
  switch (workInProgress.type) {
    case HostRoot:
      return updateHostRoot(current, workInProgress);
    case HostComponent:
      return updateHostComponent(current, workInProgress);
    case HostText:
      return null;
    default:
      return null;
  }
}
