import { REACT_ELEMENT_TYPE } from "shared/ReactSymbols";
import {
  createFiberFromText,
  createFiberFromElement,
  createWorkInProgress,
} from "./ReactFiber";
import { Placement } from "./ReactFiberFlags";
import isArray from "shared/isArray";
/**
 *
 * @param {*} shouldTrackSideEffects 是否跟踪副作用
 */
function createChildReconciler(shouldTrackSideEffects) {
  function useFiber(fiber, pendingProps) {
    const clone = createWorkInProgress(fiber, pendingProps);
    clone.sibling = null;
    return clone;
  }
  function deleteChild(returnFiber, childToDelete) {
    if (!shouldTrackSideEffects) {
      return 
    }
    const deletions = returnFiber.deletions
    if (deletions === null) {
      returnFiber.deletions = [childToDelete]
      returnFiber.flags != childToDelete
    } else {
      returnFiber.deletions.push(childToDelete)
    }
  }
  /**
   * @param {*} returnFiber 新的父fiber
   * @param {*} currentFirstChild 老fiber的第一个子fiber
   * @param {*} newChild 新的子虚拟DOM
   * @return 返回新的第一个子fiber
   */
  function reconcileSingleElement(returnFiber, currentFirstChild, element) {
    const key = element.key;
    let child = currentFirstChild;
    while (child !== null) {
      // 判断此老fiber对应的key 和新的虚拟DOM的key是否一样
      if (child.key === key) {
        // 判断老fiber对应的类型和新的元素对应的虚拟DOM是否相同
        if (child.type === element.type) {
          // 可以复用
          const existing = useFiber(child, element.props);
          existing.return = returnFiber;
          return existing;
        }
      }
      child = child.sibling;
    }
    const created = createFiberFromElement(element);
    created.return = returnFiber;
    return created;
  }
  /**
   * 设置副作用
   * @param {*} newFiber
   * @returns
   */
  function placeSingleChild(newFiber) {
    if (shouldTrackSideEffects && newFiber.alternate === null) {
      /**
       * 要在最后的提交阶段插入些节点
       * ~ React渲染分成了
       * * 渲染（创建Fiber树）与
       * * 提交 (更新真实DOM) 两个阶段
       */
      newFiber.flags |= Placement;
    }
    return newFiber;
  }
  function createChild(returnFiber, newChild) {
    if (
      (typeof newChild === "string" && newChild !== "") ||
      typeof newChild === "number"
    ) {
      const created = createFiberFromText(`${newChild}`);
      created.return = returnFiber;
      return created;
    }
    if (typeof newChild === "object" && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          const created = createFiberFromElement(newChild);
          created.return = returnFiber;
          return created;
        default:
          break;
      }
    }
    return null;
  }
  function placeChild(newFiber, mewIdx) {
    // 指定新的fiber的新的索引
    newFiber.index = mewIdx;

    if (!shouldTrackSideEffects) {
      return;
    }
    // 获取它的老fiber
    const current = newFiber.alternate;
    // 如果有 说明这是一个更新的节点，有老的真实的DOM
    if (current !== null) {
      return;
    }
    // 如果没有，说明这是一个新的节点，需要插入
    newFiber.flags |= Placement;
  }
  function updateElement(returnFiber, current, element) {
    const elementType = element.type;
    if (current !== null) {
      // 判断是否类型一样 则表示key和type都一样，可以复用老的fiber和真实DOM
      if (current.type === elementType) {
        const existing = useFiber(current, element.props);
        existing.return = returnFiber;
        return existing;
      }
    }
    const created = createFiberFromElement(element);
    created.return = returnFiber;
    return created;
  }
  function updateSlot(returnFiber, oldFiber, newChild) {
    const key = oldFiber !== null ? oldFiber.key : null;
    if (newChild !== null && typeof newChild === "object") {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE: {
          // 如果key一样，就进入更新元素的逻辑
          if (newChild.key === key) {
            return updateElement(returnFiber, oldFiber, newChild);
          }
        }
        default:
          return null;
      }
    }
    return null;
  }
  function reconcileChildrenArray(returnFiber, currentFirstChild, newChildren) {
    let resultingFirstChild = null; // 返回的第一个新儿子
    let previousNewFiber = null; // 上一个的一个新的fiber
    let mewIdx = 0; // 用来遍历新的虚拟DOM的索引
    let oldFiber = currentFirstChild; // 第一个老fiber
    let nextOldFiber = null; // 下一个老fiber

    // 开始第一轮循环 如果老fiber有值，新的虚拟DOM也有值
    for (; oldFiber !== null && mewIdx < newChildren.length; mewIdx++) {
      // 先暂存下一个老fiber
      nextOldFiber = oldFiber.sibling;
      // 试图更新或者复用老的fiber
      const newFiber = updateSlot(returnFiber, oldFiber, newChildren[mewIdx]);
      if (newFiber === null) {
        break;
      }
      if (shouldTrackSideEffects) {
        // 如果有老fiber,但新的fiber并没有成功复用老fiber和老的真实DOM，那就删除老Fiber，在提交阶段会删除真实DOM
        if (oldFiber && newFiber.alternate === null) {
          deleteChild(returnFiber, oldFiber);
        }
      }
      placeChild(newFiber, mewIdx);
      if (previousNewFiber === null) {
        resultingFirstChild = newFiber; // 链表头
      } else {
        previousNewFiber.sibling = newFiber;
      }
      previousNewFiber = newFiber;
      oldFiber = nextOldFiber;
    }

    for (; mewIdx < newChildren.length; mewIdx++) {
      const newFiber = createChild(returnFiber, newChildren[mewIdx]);
      if (newFiber === null) continue;
      placeChild(newFiber, mewIdx);
      // 如果previousNewFiber为null 说明这是第一个fiber
      if (previousNewFiber === null) {
        resultingFirstChild = newFiber;
      } else {
        previousNewFiber.sibling = newFiber;
      }
      // 让previous成为最后一个或者说上一个子fiber
      previousNewFiber = newFiber;
    }
    return resultingFirstChild;
  }
  /**
   * 比较子Fiber
   * ! DOM-Diff 就是用老的子fiber链表和新的虚拟dom进行比较的过程
   * @param {*} returnFiber 新的父fiber
   * @param {*} currentFirstChild 老fiber的第一个子fiber
   * @param {*} newChild 新的子虚拟DOM
   */
  function reconcileChildFibers(returnFiber, currentFirstChild, newChild) {
    if (typeof newChild === "object" && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(
            reconcileSingleElement(returnFiber, currentFirstChild, newChild)
          );
        default:
          break;
      }
    }
    if (isArray(newChild)) {
      return reconcileChildrenArray(returnFiber, currentFirstChild, newChild);
    }
    return null;
  }

  return reconcileChildFibers;
}

// 有老的父fiber更新的时候用这个方法
export const reconcileChildFibers = createChildReconciler(true);
// 没有老的父fiber 初始挂载的时候用这个方法
export const mountChildFibers = createChildReconciler(false);
