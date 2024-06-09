import {
  appendChild,
  insertBefore,
  commitUpdate,
  removeChild,
} from "react-dom-bindings/src/client/ReactDOMHostConfig";
import { MutationMask, Passive, Placement, Update, LayoutMask } from "./ReactFiberFlags";
import {
  FunctionComponent,
  HostComponent,
  HostRoot,
  HostText,
} from "./ReactWorkTags";
import {
  HasEffect as HookHasPassive,
  Passive as HookPassive,
  Layout as HookLayout,
  HasEffect as HookHasEffect
} from "./ReactHookEffectTags";

let hostParent = null;

/**
 * 提交删除副作用
 * @param {*} root 根节点
 * @param {*} returnFiber 父fiber
 * @param {*} deletedFiber 删除的fiber
 */
function commitDeletionEffects(root, returnFiber, deletedFiber) {
  let parent = returnFiber;
  // 一直向上找，找到真实DOM节点为止
  findParent: while (parent !== null) {
    switch (parent.tag) {
      case HostComponent:
        hostParent = parent.stateNode;
        break findParent;
      case HostRoot:
        hostParent = parent.stateNode.containerInfo;
        break findParent;
    }
    parent = parent.return;
  }
  commitDeletionEffectsOnFiber(root, returnFiber, deletedFiber);
  hostParent = null;
}

function commitDeletionEffectsOnFiber(
  finishedRoot,
  nearestMountedAncestor,
  deletedFiber
) {
  switch (deletedFiber.tag) {
    case HostComponent:
    case HostText: {
      // 当要删除一个节点的时候，要先删除它的子节点
      recursivelyTraverseDeletionEffects(
        finishedRoot,
        nearestMountedAncestor,
        deletedFiber
      );
      // 再把自己删除
      if (hostParent !== null) {
        removeChild(hostParent, deletedFiber.stateNode);
      }
      break;
    }
    default:
      break;
  }
}

function recursivelyTraverseDeletionEffects(
  finishedRoot,
  nearestMountedAncestor,
  parent
) {
  let child = parent.child;
  while (child !== null) {
    commitDeletionEffectsOnFiber(finishedRoot, nearestMountedAncestor, child);
    child = child.sibling;
  }
}

/**
 * 递归遍历处理变更的副作用
 * @param {*} root
 * @param {*} parentFiber
 */
function recursivelyTraverseMutationEffects(root, parentFiber) {
  // 先把父fiber上该删除的节点都删除
  const deletions = parentFiber.deletions;
  if (deletions !== null) {
    for (let i = 0; i < deletions.length; i++) {
      const childToDelete = deletions[i];
      commitDeletionEffects(root, parentFiber, childToDelete);
    }
  }
  // 再去处理剩下的子节点
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
  const current = finishedWork.alternate;
  const flags = finishedWork.flags;
  switch (finishedWork.tag) {
    case FunctionComponent: {
      // 先遍历它们的子节点 处理它们子节点上的副作用
      recursivelyTraverseMutationEffects(root, finishedWork);
      // 现处理自己的副作用
      commitReconciliationEffects(finishedWork);
      if (flags & Update) {
        commitHookEffectListUnmount(HookHasEffect | HookLayout, finishedWork)
      }
      break;
    }
    case HostComponent:
    case HostText: {
      // 先遍历它们的子节点 处理它们子节点上的副作用
      recursivelyTraverseMutationEffects(root, finishedWork);
      // 现处理自己的副作用
      commitReconciliationEffects(finishedWork);
      break;
    }
    case HostRoot: {
      // 先遍历它们的子节点 处理它们子节点上的副作用
      recursivelyTraverseMutationEffects(root, finishedWork);
      // 现处理自己的副作用
      commitReconciliationEffects(finishedWork);
      // 处理DOM更新
      if (flags & Update) {
        // 获取真实DOM
        const instance = finishedWork.stateNode;
        if (instance !== null) {
          // 更新真实DOM
          const newProps = finishedWork.memoizedProps;
          const oldProps = current !== null ? current.memoizedProps : newProps;
          const type = finishedWork.type;
          const updatePayload = finishedWork.updateQueue;
          finishedWork.updateQueue = null;
          if (updatePayload) {
            commitUpdate(instance, updatePayload, type, oldProps, newProps, finishedWork);
          }
        }
      }
      break;
    }
    default:
      break;
  }
}

export function commitPassiveUnmountEffects(finishedWork) {
  commitPassiveUnmountOnFiber(finishedWork)
}

function commitPassiveUnmountOnFiber(finishedWork) {
  const flags = finishedWork.flags
  switch (finishedWork.tag) {
    case HostRoot:
      recursivelyTraverseUnmountEffects(finishedWork)
      break;
    case FunctionComponent:
      recursivelyTraverseUnmountEffects(finishedWork)
      if (flags & Passive) {
        commitHookPassiveUnmountEffects(HookHasPassive | HookPassive)
      }
      break;
  }
}

function recursivelyTraverseUnmountEffects(finishedRoot, parentFiber) {
  if (parentFiber.subtreeFlags & Passive) {
    let child = parent.child
    while (child !== null) {
      commitPassiveUnmountOnFiber(root, child)
      child = child.sibling
    }
  }
}

function commitHookPassiveUnmountEffects(finishedWork, hookFlags) {
  commitHookEffectListUnmount(hookFlags, finishedWork)
}

function commitHookEffectListUnmount(flags, finishedWork) {
  const updateQueue = finishedWork.updateQueue
  const lastEffect = updateQueue !== null ? updateQueue.lastEffect : null
  if (lastEffect !== null) {
    const firstEffect = lastEffect.next
    let effect = firstEffect
    do {
      if ((effect.tag & flags) === flags) {
        const destroy = effect.create
        if (destroy !== undefined) {
          destroy()
        }
      }
      effect = effect.next
    } while (effect !== firstEffect)
  }
}

export function commitPassiveMountEffects(root, finishedWork) {
  commitPassiveMountOnFiber(root, finishedWork);
}

function commitPassiveMountOnFiber(finishedRoot, finishedWork) {
  const flags = finishedWork.flags;
  switch (finishedWork.tag) {
    case HostRoot:
      recursivelyTraverseMountEffects(finishedRoot, finishedWork);
      break;
    case FunctionComponent:
      recursivelyTraverseMountEffects(finishedRoot, finishedWork);
      if (flags & Passive) {
        commitHookPassiveMountEffects(finishedWork, HookHasPassive | HookPassive);
      }
      break;
  }
}

function recursivelyTraverseMountEffects(root, parentFiber) {
  if (parentFiber.subtreeFlags & Passive) {
    let child = parent.child
    while (child !== null) {
      commitPassiveMountOnFiber(root, child)
      child = child.sibling
    }
  }
}

function commitHookPassiveMountEffects(finishedWork, hookFlags) {
  commitHookEffectListMount(hookFlags, finishedWork)
}

function commitHookEffectListMount(flags, finishedWork) {
  const updateQueue = finishedWork.updateQueue
  const lastEffect = updateQueue !== null ? updateQueue.lastEffect : null
  if (lastEffect !== null) {
    const firstEffect = lastEffect.next
    let effect = firstEffect
    do {
      if ((effect.tag & flags) === flags) {
        const create = effect.create
        effect.destroy = create()
      }
      effect = effect.next
    } while (effect !== firstEffect)
  }
}

export function commitLayoutEffects(finishedWork, root) {
  const current = finishedWork.alternate
  commitLayoutEffectOnFiber(root, current, finishedWork)
}

function commitLayoutEffectOnFiber(finishedRoot, current, finishedWork) {
  const flags = finishedWork.flags;
  switch (finishedWork.tag) {
    case HostRoot:
      recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
      break;
    case FunctionComponent:
      recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
      if (flags & LayoutMask) {
        commitHookLayoutEffects(finishedWork, HookHasPassive | HookLayout);
      }
      break;
  }
}

function commitHookLayoutEffects(finishedWork, hookFlags) {
  commitHookEffectListMount(hookFlags, finishedWork)
}

function recursivelyTraverseLayoutEffects(root, parentFiber) {
  if (parentFiber.subtreeFlags & Passive) {
    let child = parent.child
    while (child !== null) {
      const current = child.alternate
      commitLayoutEffectOnFiber(root, current, child)
      child = child.sibling
    }
  }
}