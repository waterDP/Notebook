import {
  appendChild,
  insertBefore,
} from "react-dom-bindings/src/client/ReactDOMHostConfig";
import { MutationMask, Placement } from "./ReactFiberFlags";
import {
  FunctionComponent,
  HostComponent,
  HostRoot,
  HostText,
} from "./ReactWorkTags";

function recursivelyTraverseMutationEffects(root, parentFiber) {
  if (parentFiber.subtreeFlags & MutationMask) {
    let { child } = parentFiber;
    while (child !== null) {
      commitMutationEffectsOnFiber(child, root);
      child = child.sibling;
    }
  }
}

function commitReconciliationEffects(finishedWork) {
  const { flags } = finishedWork;
  // 如果此fiber要进行插入操作的话
  if (flags & Placement) {
    // 进行插入操作，也就是把此fiber对应的真实DOM添加到父真实DOM节点上
    commitPlacement(finishedWork);
    // 把flags里的Placement删除
    finishedWork.flags & ~Placement;
  }
}

function isHostParent(fiber) {
  return fiber.tag === HostComponent || fiber.tag === HostRoot;
}

function getHostParentFiber(fiber) {
  let parent = fiber.return;
  while (parent !== null) {
    if (isHostParent(parent)) {
      return parent;
    }
    parent = parent.return;
  }
}

/**
 * 把子节点对应的真实DOM插入到父节点DOM中
 * @param {*} node 要插入的fiber节点
 * @param {*} parent 父真实DOM节点
 */
function insertOrAppendPlacementNode(node, before, parent) {
  const { tag } = node;
  const isHost = tag === HostComponent || tag === HostText;
  if (isHost) {
    const { stateNode } = node;
    if (before) {
      insertBefore(parent, stateNode, before);
    } else {
      appendChild(parent, stateNode);
    }
  } else {
    // 如果node不是真实DOM节点 获取它的大儿子
    const { child } = node;
    if (child !== null) {
      // 把大儿子添加到父亲的DOM节点里面去
      insertOrAppendPlacementNode(child, before, parent);
      let { sibling } = child;
      while (sibling !== null) {
        insertOrAppendPlacementNode(sibling, before, parent);
        sibling = sibling.sibling;
      }
    }
  }
}

/**
 * ! hard  找到要插入的锚点
 * 找到可以插在它前面的那个fiber对应的真实DOM
 * @param {*} fiber
 */
function getHostSibling(fiber) {
  let node = fiber;
  siblings: while (true) {
    while (node.sibling === null) {
      if (node.return === null || isHostParent(node.return)) {
        return null;
      }
      node = node.return;
    }
    node = node.sibling;
    // 如果弟弟不是原生节点也不是文本节点  不能用
    while (node.tag !== HostComponent && node.tag !== HostText) {
      // 如果此节点是一个将要插入的新的节点，找它的弟弟
      if (node.flags & Placement) {
        continue siblings;
      } else {
        node = node.child;
      }
    }
    if (!(node.flags & Placement)) {
      return node.stateNode;
    }
  }
}

/**
 * 把此fiber的真实DOM插入到父节点
 * @param {*} finishedWork
 */
function commitPlacement(finishedWork) {
  const parentFiber = getHostParentFiber(finishedWork);
  switch (parentFiber.tag) {
    case HostRoot: {
      const parent = parentFiber.stateNode.containerInfo;
      const before = getHostSibling(finishedWork); // 获取最近的弟弟DOM节点
      insertOrAppendPlacementNode(finishedWork, before, parent);
      break;
    }
    case HostComponent: {
      const parent = parentFiber.stateNode;
      const before = getHostSibling(finishedWork);
      insertOrAppendPlacementNode(finishedWork, before, parent);
      break;
    }
    default:
      break;
  }
}

/**
 * 遍历fiber树，执行fiber上的副作用
 * @param {*} finishedWork fiber节点
 * @param {*} root 根节点
 */
export function commitMutationEffectsOnFiber(finishedWork, root) {
  switch (finishedWork.tag) {
    case FunctionComponent:
    case HostRoot:
    case HostComponent:
    case HostText:
      // 先遍历它们的子节点 处理它们子节点上的副作用
      recursivelyTraverseMutationEffects(root, finishedWork);
      // 现处理自己的副作用
      commitReconciliationEffects(finishedWork);
      break;
    default:
      break;
  }
}
