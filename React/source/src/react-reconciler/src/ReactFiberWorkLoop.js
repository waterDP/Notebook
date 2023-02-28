/*
 * @Author: water.li
 * @Date: 2023-02-26 23:12:04
 * @Description:
 * @FilePath: \Notebook\React\source\src\react-reconciler\src\ReactFiberWorkLoop.js
 */
import { scheduleCallback } from "scheduler";
import { createWorkInProgress } from "./ReactFiber";
import { beginWork } from "./ReactFiberBeginWork";

let workInProgress = null;

/**
 * 计划更新root
 * @param {*} root
 */
export function scheduleUpdateOnFiber(root) {
  // 确保调度执行root上的更新
  ensureRootIsScheduled(root);
}

function ensureRootIsScheduled(root) {
  scheduleCallback(performConcurrentWorkOnRoot.bind(null, root));
}

/**
 * 根据vdom构建fiber树 要创建真实的Dom节点 把真实的dom节点插入容器
 * @param {*} root
 */
function performConcurrentWorkOnRoot(root) {
  // 第一次渲染以同步的方式渲染根节点 初次渲染的时候 都是同步的
  renderRootSync(root);
}

function prepareFreshStack(root) {
  workInProgress = createWorkInProgress(root.current, null);
}

function renderRootSync(root) {
  // !开始构建 fiber 树
  prepareFreshStack(root);
  workLoopSync();
}

function workLoopSync() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

function performUnitOfWork(unitOfWork) {
  // 获取新的fiber对应的老的fiber
  const current = unitOfWork.alternate;
  // 完成当前fiber的子fiber链表构建后
  const next = beginWork(current, unitOfWork);
  unitOfWork.memoizedProps = unitOfWork.pendingProps;
  if (next === null) {
    // 如果没有子节点，说明当前fiber已经完成了
    // completeUnitOfWork(unitOfWork);
  } else {
    // 如果有子节点就让子节点成为下一个工作单元
    workInProgress = next;
  }
}
