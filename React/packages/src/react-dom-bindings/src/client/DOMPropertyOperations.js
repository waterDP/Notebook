/*
 * @Author: water.li
 * @Date: 2023-03-04 22:28:50
 * @Description:
 * @FilePath: \Notebook\React\source\src\react-dom-bindings\src\client\DOMPropertyOperations.js
 */

export function setValueForProperty(node, name, value) {
  if (value === null) {
    node.removeAttribute(name);
  } else {
    node.setAttribute(name, value);
  }
}
