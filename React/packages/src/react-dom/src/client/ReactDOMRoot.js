/*
 * @Author: water.li
 * @Date: 2023-01-03 22:46:32
 * @Description:
 * @FilePath: \Notebook\React\packages\src\react-dom\src\client\ReactDOMRoot.js
 */

import {
  createContainer,
  updateContainer,
} from "react-reconciler/src/ReactFiberReconciler";
import { listenToAllSupportedEvents } from "react-dom-bindings/src/events/DOMPluginEventSystem";

function ReactDOMRoot(internalRoot) {
  // div#root
  this._internalRoot = internalRoot;
}

ReactDOMRoot.prototype.render = function (children) {
  const root = this._internalRoot;
  root.containerInfo.innerHTML = ""; // ? 临时清空 DOM-DIFF
  updateContainer(children, root);
};

export function createRoot(container) {
  // div#root
  const root = createContainer(container);
  listenToAllSupportedEvents(container);
  return new ReactDOMRoot(root);
}
