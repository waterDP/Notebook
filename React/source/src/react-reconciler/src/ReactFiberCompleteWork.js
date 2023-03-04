import logger, { indent } from "shared/logger";
import { HostComponent, HostRoot, HostText } from "./ReactWorkTags";
import {
  createTextInstance,
  createInstance,
  appendInitialChild,
  finializeInitialChildren,
} from "react-dom-bindings/src/client/ReactDOMHostConfig";
import { NoFlags } from "./ReactFiberFlags";

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

/**
 * 完成一个fiber节点
 * @param {*} current
 * @param {*} workInProgress
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
    case HostComponent:
      // 如果完成的是一个原生节点的话
      // 创建真实的DOM节点
      const { type } = workInProgress;
      const instance = createInstance(type, newProps, workInProgress);
      // 把自己所有的儿子都挂载到处理身上
      workInProgress.stateNode = instance;
      appendAllChildren(instance, workInProgress);
      finializeInitialChildren(instance, type, newProps);
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
