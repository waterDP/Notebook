import { REACT_ELEMENT_TYPE } from "shared/ReactSymbols";
import { createFiberElement, createFiberFromText } from "./ReactFiber";
import { Placement } from "./ReactFiberFlags";
import isArray from "shared/isArray";
/**
 *
 * @param {*} shouldTrackSideEffects 是否跟踪副作用
 */
function createChildReconciler(shouldTrackSideEffects) {
  function reconcileSingleElement(returnFiber, currentFirstFiber, element) {
    const created = createFiberElement(element);
    created.return = returnFiber;
    return created;
  }
  /**
   * 设置副作用
   * @param {*} newFiber
   * @returns
   */
  function placeSingleChild(newFiber) {
    if (shouldTrackSideEffects) {
      /**
       * 要在最后的提交阶段插入些节点
       * ~ React渲染分成了
       * * 渲染（创建Fiber树挂）与
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
      createChild.return = returnFiber;
      return created;
    }
    if (typeof newChild === "object" && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          // ? const created = createFiberFromElement(newChild);
          createChild.return = returnFiber;
          return created;
        default:
          break;
      }
    }
    return null;
  }
  function placeChild(newFiber, newIndex) {
    newFiber.index = newIndex;
    if (shouldTrackSideEffects) {
      // 如果一个fiber它的flags上有 Placement，说明此节点需要创建真实DOM 并且插入到父容器中
      newFiber.flags |= Placement;
    }
  }
  function reconcileChildrenArray(returnFiber, currentFirstFiber, newChildren) {
    let resultingFirstChild = null; // 返回的第一个新儿子
    let previousNewFiber = null; // 上一个的一个新的fiber
    let newIndex = 0;
    for (; newIndex < newChildren.length; newIndex++) {
      const newFiber = createChild(returnFiber, newChildren[newIndex]);
      if (newFiber === null) continue;
      placeChild(newFiber, newIndex);
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
   * @param {*} currentFirstFiber 老fiber的第一个子fiber
   * @param {*} newChild 新的子虚拟DOM
   */
  function reconcileChildFibers(returnFiber, currentFirstFiber, newChild) {
    if (typeof newChild === "object" && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(
            reconcileSingleElement(returnFiber, currentFirstFiber, newChild)
          );
        default:
          break;
      }
    }
    if (isArray(newChild)) {
      return reconcileChildrenArray(returnFiber, currentFirstFiber, newChild);
    }
    return null;
  }

  return reconcileChildFibers;
}

// 有老的父fiber更新的时候用这个方法
export const reconcileChildFibers = createChildReconciler(true);
// 没有老的父fiber 初始挂载的时候用这个方法
export const mountChildFibers = createChildReconciler(false);
