/*
 * @Author: water.li
 * @Date: 2023-02-28 22:41:05
 * @Description:
 * @FilePath: \Notebook\React\source\src\react-reconciler\src\ReactFiberBeginWork.js
 */

import logger, { indent } from "shared/logger";
import { HostComponent, HostRoot, HostText } from "./ReactWorkTags";
import { processUpdateQueue } from "./ReactFiberClassUpdateQueue";
import { mountChildFibers, reconcileChildFibers } from "./ReactChildFiber";
import { shouldSetTextContent } from "react-dom-bindings/src/ReactDOMHostConfig";

/**
 * 根据新的虚拟DOM生成新的fiber链表
 * @param {*} current 老的父fiber
 * @param {*} workInProgress 新的父fiber
 * @param {*} nextChildren 新的子虚拟dom
 */
function reconcileChildren(current, workInProgress, nextChildren) {
  // 如果此新fiber没有老fiber 说明此新fiber是新创建的
  if (current === null) {
    workInProgress.child = mountChildFibers(workInProgress, null, nextChildren);
  } else {
    // 如果说有老Fiber的话做DOM_DIFF 拿老的子fiber子链表和新虚拟DOM进行最小化的更新
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current.child,
      nextChildren
    );
  }
}

function updateHostRoot(current, workInProgress) {
  // 子vdom
  processUpdateQueue(workInProgress); // workInProgress.memoizedState = {element}
  const nextState = workInProgress.memoizedState;
  // nextChildren就是新的虚拟dom
  let nextChildren = nextState.element;
  // ! 协调子节点 DOM-DIFF算法
  reconcileChildren(current, workInProgress, nextChildren);
  return workInProgress.child; // {tag: 5, type: 'h1'}
}

/**
 * 构建原生组件的子fiber链表
 * @param {*} current 老fiber
 * @param {*} workInProgress 新fiber
 */
function updateHostComponent(current, workInProgress) {
  const { type } = workInProgress;
  const nextProps = workInProgress.pendingProps;
  let nextChildren = nextProps.children;
  // 判断当前虚拟DOM是不是文本的独生子，如果是的话nextChild=null
  const isDirectTextChild = shouldSetTextContent(type, nextProps);
  if (isDirectTextChild) {
    nextChildren = null;
  }

  reconcileChildren(current, workInProgress, nextChildren);
  return workInProgress.child;
}

/**
 * 目标是根据vdom构建新的fiber子链表
 * @param {*} current 老fiber
 * @param {*} workInProgress 新fiber
 */
export function beginWork(current, workInProgress) {
  logger(" ".repeat(indent.number) + "beginWork", workInProgress);
  indent.number += 2;
  switch (workInProgress.tag) {
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
