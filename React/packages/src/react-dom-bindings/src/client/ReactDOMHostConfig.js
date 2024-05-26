/*
 * @Author: water.li
 * @Date: 2023-03-01 23:53:47
 * @Description:
 * @FilePath: \Notebook\React\packages\src\react-dom-bindings\src\client\ReactDOMHostConfig.js
 */
import {
  setInitialProperties,
  diffProperties,
  updateProperties,
} from "./ReactDOMComponent";
import { precacheFiberNode, updateFiberProps } from "./ReactDOMComponentTree";

export function shouldSetTextContent(type, props) {
  return (
    typeof props.children === "string" || typeof props.children === "number"
  );
}

export function createTextInstance(content) {
  return document.createTextNode(content);
}

/**
 * 在原生组件初始挂载的时候，会通过此方法创建真实的DOM
 * @param {*} type 类型span
 * @param {*} props 属性
 * @param {*} internalInstanceHandle 它对应的fiber
 * @returns
 */
export function createInstance(type, props, internalInstanceHandle) {
  const domElement = document.createElement(type);
  // 预先缓存fiber节点在DOM元素上
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

export function prepareUpdate(domElement, type, oldProps, newProps) {
  return diffProperties(domElement, type, oldProps, newProps);
}

export function commitUpdate(
  domElement,
  updatePayload,
  type,
  oldProps,
  newProps
) {
  updateProperties(domElement, updatePayload, type, oldProps, newProps);
  updateFiberProps(domElement, newProps);
}

export function removeChild(parentInstance, child) {
  parentInstance.removeChild(child);
}
