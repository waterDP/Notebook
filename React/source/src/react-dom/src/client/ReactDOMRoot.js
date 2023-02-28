/*
 * @Author: water.li
 * @Date: 2023-01-03 22:46:32
 * @Description:
 * @FilePath: \Notebook\React\source\src\react-dom\src\client\ReactDOMRoot.js
 */

import {
  createContainer,
  updateContainer,
} from "react-reconciler/src/ReactFiberReconciler";

function ReactDOMRoot(internalRoot) {
  this._internalRoot = internalRoot;
}

ReactDOMRoot.prototype.render = function (children) {
  const root = this._internalRoot;
  updateContainer(children, root);
};

export function createRoot(container) {
  // div#root
  const root = createContainer(container);
  return new ReactDOMRoot(root);
}
