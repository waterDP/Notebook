import logger, { indent } from "shared/logger";
import {
  createTextInstance,
  createInstance,
  appendInitialChild,
  finializeInitialChildren,
  prepareUpdate,
} from "react-dom-bindings/src/client/ReactDOMHostConfig";
import { NoFlags, Update } from "./ReactFiberFlags";
import {
  HostComponent,
  HostRoot,
  HostText,
  FunctionComponent,
} from "./ReactWorkTags";

/**
 * 把当前完成的fiber所有的子节点对应的真实DOM都挂载到自己父parent真实DOM节点上
 * @param {*} parent
 * @param {*} workInProgress
 */
function appendAllChildren(parent, workInProgress) {
  let node = workInProgress.child;
  while (node) {
    // 如果子节点的类型是一个原生节点或者是一个文本节点
    if (node.tag === HostComponent || node.tag === HostText) {
      appendInitialChild(parent, node.stateNode);
    } else if (node.child !== null) {
      // 如果第一个儿子不是原生节点，说明它可能是一个函数组件
      node = node.child;
      continue;
    }
    if (node === workInProgress) {
      return;
    }
    while (node.sibling === null) {
      if (node.return === null || node.return === workInProgress) {
        return;
      }
      node = node.return;
    }
    node = node.sibling;
  }
}

function markUpdate(workInProgress) {
  workInProgress.flags |= Update; // 给当前的fiber添加更新的副作用
}

/**
 * 在fiber(button)的完成阶段准备更新DOM
 * @param {*} current button的老fiber
 * @param {*} workInProgress button的新fiber
 * @param {*} type 类型
 * @param {*} newProps 新属性
 */
function updateHostComponent(current, workInProgress, type, newProps) {
  const oldProps = current.memoizedProps;
  const instance = workInProgress.stateNode; // 老的DOM节点
  // 比较新老属性 收集属性的差异
  const updatePayload = prepareUpdate(instance, type, oldProps, newProps);

  workInProgress.updateQueue = updatePayload;
  if (updatePayload) {
    markUpdate(workInProgress);
  }
}

/**
 * 完成一个fiber节点
 * @param {*} current 老fiber
 * @param {*} workInProgress 新的构建的fiber
 */
export function completeWork(current, workInProgress) {
  indent.number -= 2;
  logger(" ".repeat(indent.number) + "completeWork", workInProgress);
  const newProps = workInProgress.pendingProps;
  switch (workInProgress.tag) {
    case HostRoot:
      // 根节点
      bubbleProperties(workInProgress);
      break;
    case FunctionComponent:
      // 根节点
      bubbleProperties(workInProgress);
      break;
    case HostComponent:
      // 如果完成的是一个原生节点的话
      // 创建真实的DOM节点
      const { type } = workInProgress;
      if (current !== null && workInProgress.stateNode !== null) {
        // 如何老的Fiber存在，并且老fiber上真实DOM节点，要走节点更新的逻辑
        updateHostComponent(current, workInProgress, type, newProps);
      } else {
        const instance = createInstance(type, newProps, workInProgress);
        // 把自己所有的儿子都挂载到处理身上
        workInProgress.stateNode = instance;
        appendAllChildren(instance, workInProgress);
        finializeInitialChildren(instance, type, newProps);
      }
      bubbleProperties(workInProgress);
      break;
    case HostText:
      // 如果完成的fiber是文本节点，那就创建一个真实的文本节点
      const newText = newProps;
      // 创建真实的DOM节点
      workInProgress.stateNode = createTextInstance(newText);
      // 向上冒泡属性
      bubbleProperties(workInProgress);
      break;
  }
}

function bubbleProperties(completedWork) {
  let subtreeFlags = NoFlags;
  // 遍历当前fiber的所有子节点，把所有子节点的副作用，以及子节点的子节点副作用全部合并
  let child = completedWork.child;
  while (child !== null) {
    subtreeFlags |= child.subtreeFlags;
    subtreeFlags |= child.flags;
    child = child.sibling;
  }
  completedWork.subtreeFlags = subtreeFlags;
}
