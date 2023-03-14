/*
 * @Author: water.li
 * @Date: 2023-03-01 23:53:47
 * @Description:
 * @FilePath: \Notebook\React\source\src\react-dom-bindings\src\client\ReactDOMHostConfig.js
 */
import { setInitialProperties } from "./ReactDOMComponent";
import { precacheFiberNode, updateFiberProps } from "./ReactDOMComponentTree";

export function shouldSetTextContent(type, props) {
  return (
    typeof props.children === "string" || typeof props.children === "number"
  );
}

export function createTextInstance(content) {
  return document.createTextNode(content);
}

export function createInstance(type, props, internalInstanceHandle) {
  const domElement = document.createElement(type);
  precacheFiberNode(internalInstanceHandle, domElement);
  // 把属性直接保存在domElement的属性上
  updateFiberProps(domElement, props);
  return domElement;
}

export function appendInitialChild(parent, child) {
  parent.appendChild(child);
}

export function finializeInitialChildren(domElement, type, props) {
  setInitialProperties(domElement, type, props);
}

export function appendChild(parentInstance, child) {
  parentInstance.appendChild(child);
}

export function insertBefore(parentInstance, child, beforeChild) {
  parentInstance.insertBefore(child, beforeChild);
}
