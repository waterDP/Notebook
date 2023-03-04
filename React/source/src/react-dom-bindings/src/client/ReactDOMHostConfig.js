/*
 * @Author: water.li
 * @Date: 2023-03-01 23:53:47
 * @Description:
 * @FilePath: \Notebook\React\source\src\react-dom-bindings\src\client\ReactDOMHostConfig.js
 */
import { setInitialProperties } from "./ReactDOMComponent";

export function shouldSetTextContent(type, props) {
  return (
    typeof props.children === "string" || typeof props.children === "number"
  );
}

export function createTextInstance(content) {
  return document.createTextNode(content);
}

export function createInstance(type) {
  const domElement = document.createElement(type);
  return domElement;
}

export function appendInitialChild(parent, child) {
  parent.appendChild(child);
}

export function finializeInitialChildren(domElement, type, props) {
  setInitialProperties(domElement, type, props);
}
