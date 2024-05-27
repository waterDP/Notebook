import { REACT_ELEMENT_TYPE } from "shared/ReactSymbols";
import {
  createFiberFromText,
  createFiberFromElement,
  createWorkInProgress,
} from "./ReactFiber";
import { ChildDeletion, Placement } from "./ReactFiberFlags";
import isArray from "shared/isArray";
import { HostText } from "./ReactWorkTags";
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
      return;
    }
    const deletions = returnFiber.deletions;
    if (deletions === null) {
      returnFiber.deletions = [childToDelete];
      returnFiber.flags |= ChildDeletion;
    } else {
      returnFiber.deletions.push(childToDelete);
    }
  }
  // 删除从currentFirstChild之后所有的fiber节点
  function deleteRemainingChildren(returnFiber, currentFirstChild) {
    if (!shouldTrackSideEffects) {
      return;
    }
    let childToDelete = currentFirstChild;
    while (childToDelete !== null) {
      deleteChild(returnFiber, childToDelete);
      childToDelete = childToDelete.sibling;
    }
    return null;
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
          deleteRemainingChildren(returnFiber, child.sibling);
          // 可以复用
          const existing = useFiber(child, element.props);
          existing.return = returnFiber;
          return existing;
        } else {
          // 如果找到一key一样的老fiber 但是类型不一样，不能复用此老fiber 就把剩下的全部删除
          deleteRemainingChildren(returnFiber, child);
        }
      } else {
        deleteChild(returnFiber, child);
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
  function placeChild(newFiber, lastPlacedIndex, mewIdx) {
    // 指定新的fiber的新的索引
    newFiber.index = mewIdx;

    if (!shouldTrackSideEffects) {
      return;
    }
    // 获取它的老fiber
    const current = newFiber.alternate;
    // 如果有 说明这是一个更新的节点，有老的真实的DOM
    if (current !== null) {
      const oldIndex = current.index;
      // 如果找到的老的fiber的索引比lastPlacedIndex要小，则老fiber对应的DOM节点需要移动
      if (oldIndex < lastPlacedIndex) {
        newFiber.flags |= Placement;
        return lastPlacedIndex;
      }
      return oldIndex;
    }
    // 如果没有，说明这是一个新的节点，需要插入
    newFiber.flags |= Placement;
    return lastPlacedIndex;
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
    // 不能复用 就新建
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
  function mapRemainingChildren(returnFiber, currentFirstChild) {
    const existingChildren = new Map();
    let existingChild = currentFirstChild;
    while (existingChild !== null) {
      if (existingChild.key !== null) {
        existingChildren.set(existingChild.key, existingChild);
      } else {
        existingChildren.set(existingChild.index, existingChild);
      }
      existingChild = existingChild.sibling;
    }
    return existingChildren;
  }
  function updateTextNode(returnFiber, current, textContent) {
    if (current === null || current.tag !== HostText) {
      const created = createFiberFromText(textContent);
      created.return = returnFiber;
      return created;
    }
    const existing = useFiber(current, textContent);
    existing.returnFiber = returnFiber;
    return returnFiber;
  }
  function updateFromMap(existingChildren, returnFiber, newIdx, newChild) {
    if (
      (typeof newChild === "string" && newChild !== "") ||
      typeof newChild === "number"
    ) {
      const matchedFiber = existingChildren.get(newIdx) || null;
      return updateTextNode(returnFiber, matchedFiber, "" + newIdx);
    }
    if (typeof newChild === "object" && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE: {
          const matchedFiber =
            existingChildren.get(
              newChild.key === null ? newIdx : newChild.key
            ) || null;
          return updateElement(returnFiber, matchedFiber, newChild);
        }
      }
    }
  }
  function reconcileChildrenArray(returnFiber, currentFirstChild, newChildren) {
    let resultingFirstChild = null; // 返回的第一个新儿子
    let previousNewFiber = null; // 上一个的一个新的fiber
    let mewIdx = 0; // 用来遍历新的虚拟DOM的索引
    let oldFiber = currentFirstChild; // 第一个老fiber
    let nextOldFiber = null; // 下一个老fiber
    let lastPlacedIndex = 0; // 上一个不需要移动的老节点的索引

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
      lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, mewIdx);
      if (previousNewFiber === null) {
        resultingFirstChild = newFiber; // 链表头
      } else {
        previousNewFiber.sibling = newFiber;
      }
      previousNewFiber = newFiber;
      oldFiber = nextOldFiber;
    }

    if (newIdx === newChildren.length) {
      // 删除剩下的老fiber
      deleteRemainingChildren(returnFiber, oldFiber);
      return resultingFirstChild;
    }

    if (oldFiber === null) {
      // 如果老的fiber已经没有了，新的虚拟DOM还有，进入插入新节点的逻辑
      for (; mewIdx < newChildren.length; mewIdx++) {
        const newFiber = createChild(returnFiber, newChildren[mewIdx]);
        if (newFiber === null) continue;
        lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, mewIdx);
        // 如果previousNewFiber为null 说明这是第一个fiber
        if (previousNewFiber === null) {
          resultingFirstChild = newFiber;
        } else {
          previousNewFiber.sibling = newFiber;
        }
        // 让previous成为最后一个或者说上一个子fiber
        previousNewFiber = newFiber;
      }
    }

    // 开始处理移动的情况
    const existingChildren = mapRemainingChildren(returnFiber, oldFiber);
    // 开始遍历剩下的虚拟DOM子节点
    for (; newIdx < newChildren.length; newIdx++) {
      const newFiber = updateFromMap(
        existingChildren,
        returnFiber,
        newIdx,
        newChildren[newIdx]
      );
      if (newFiber !== null) {
        if (shouldTrackSideEffects) {
          // 如果要跟踪副作用，并用有老fiber
          if (newFiber.alternate !== null) {
            existingChildren.delete(
              newFiber.key === null ? newIdx : newFiber.key
            );
          }
        }
        lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
        // 如果previousNewFiber为null 说明这是第一个fiber
        if (previousNewFiber === null) {
          resultingFirstChild = newFiber;
        } else {
          previousNewFiber.sibling = newFiber;
        }
        // 让previous成为最后一个或者说上一个子fiber
        previousNewFiber = newFiber;
      }
    }
    if (shouldTrackSideEffects) {
      // 等全部处理完后，删除map中所有剩下的老fiber
      existingChildren.forEach((child) => deleteChild(returnFiber, child));
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
