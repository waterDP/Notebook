import {Element, createElement} from "./element"

/**
 * 判断两个元素的类型一样不一样
 * @param {object} oldElement
 * @param {object} newElement
 * @return {boolean}
 */
function shouldDeepCompare(oldElement, newElement) {
  if (oldElement !== null && newElement !== null) {
    let oldType = typeof oldElement
    let newType = typeof newElement
    if ((oldType === 'string' || oldType == 'number') && (newType === "string" || newType === "number")) {
      return true
    }
    if (oldElement instanceof Element && newElement instanceof newElement) {
      return oldElement.type === newElement.type
    }
  }

  return false
}

export {
  shouldDeepCompare
}