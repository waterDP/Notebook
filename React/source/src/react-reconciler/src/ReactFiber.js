/*
 * @Author: water.li
 * @Date: 2023-01-03 23:24:58
 * @Description:
 * @FilePath: \Notebook\React\source\src\react-reconciler\src\ReactFiber.js
 */
import {
  HostComponent,
  HostRoot,
  HostText,
  IndeterminateComponent,
} from "./ReactWorkTags";
import { NoFlags } from "./ReactFiberFlags";
/**
 *
 * @param {*} tag fiber的类型 函数组件0   类组件1 原生组件5 根元素3等
 * @param {*} pendingProps 新属性，等待处理或说生效的属性
 * @param {*} key 唯一标识
 */
export function FiberNode(tag, pendingProps, key) {
  this.tag = tag;
  this.key = key;
  this.type = null; // fiber类型 来自于 虚拟DOM的type div p span
  this.stateNode = null; // 此fiber对应的真实的DOM节点

  this.return = null; // 指向父节点
  this.child = null; // 指向第一个子节点
  this.sibling = null; // 指向弟弟

  this.pendingProps = pendingProps; // 等待生效的属性
  this.memoizedProps = null; // 已经生效的属性

  this.memoizedState = null;
  this.updateQueue = null; // 每个fiber身上可能的更新队列

  this.flags = NoFlags; // 副作用的标识，表示要针对此fiber节点进行何种操作
  this.subtreeFlags = NoFlags; // 子节点对应的副作用的标识
  // 替身 轮替 DOM-DIFF
  this.alternate = null;
  this.index = 0;
}

export function createFiber(tag, pendingProps, key) {
  return new FiberNode(tag, pendingProps, key);
}

export function createHostRootFiber() {
  return createFiber(HostRoot, null, null);
}

/**
 * 基于老的fiber和新的属性创建新的fiber
 * @param {*} current
 * @param {*} pendingProps
 */
export function createWorkInProgress(current, pendingProps) {
  let workInProgress = current.alternate;
  if (workInProgress === null) {
    workInProgress = createFiber(current.tag, pendingProps, current.key);
    workInProgress.type = current.type;
    workInProgress.stateNode = current.stateNode;
    workInProgress.alternate = current; // alternate相互指向
    current.alternate = workInProgress;
  } else {
    workInProgress.pendingProps = current.pendingProps;
    workInProgress.type = current.type;
    workInProgress.flags = NoFlags;
    workInProgress.subtreeFlags = NoFlags;
  }
  workInProgress.child = current.child;
  workInProgress.memoizedProps = current.memoizedProps;
  workInProgress.memoizedState = current.memoizedState;
  workInProgress.updateQueue = current.updateQueue;
  workInProgress.sibling = current.sibling;
  workInProgress.index = current.index;

  return workInProgress;
}

/**
 * 模拟虚拟DOM创建Fiber节点
 * @param {*} element
 */
export function createFiberElement(element) {
  const { type, key, props: pendingProps } = element;
  return createFiberFromTypeAndProps(type, key, pendingProps);
}

function createFiberFromTypeAndProps(type, key, pendingProps) {
  let tag = IndeterminateComponent;
  // 如果类型type是一个字符串 span div 说明此Fiber类型是一个原生组件
  if (typeof type === "string") {
    tag = HostComponent;
  }
  const fiber = createFiber(tag, pendingProps, key);
  fiber.type = type;
  return fiber;
}

export function createFiberFromText(content) {
  return createFiber(HostText, content, null);
}
