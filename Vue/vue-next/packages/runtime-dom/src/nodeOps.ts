/*
 * @Author: water.li
 * @Date: 2022-04-09 21:21:30
 * @Description: 
 * @FilePath: \note\Vue\vue-next\packages\runtime-dom\src\nodeOps.ts
 */

export const nodeOps = {
  insert: (child, parent, anchor = null) => {
    parent.insertBefore(child, anchor)
  },
  remove: child => {
    const parent = child.parent
    parent && parent.removeChild(child)
  },
  createElement: tag => document.createElement(tag),
  createText: text => document.createTextNode(text),
  setElementText: (el, text) => el.textContent = text,
  setText: (node, text) => node.nodeValue = text,
  parentNode: node => node.parentNode,
  nextSibling: node => node.nextSibling,
  querySelector: selector => selector.querySelector(selector)
}
// runtime-dom提供节点操作的api -> 传递给runtime-core