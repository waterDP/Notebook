/*
 * @Author: water.li
 * @Date: 2023-01-03 22:46:32
 * @Description:
 * @FilePath: \Notebook\React\源码\react-dom\src\client\ReactDOMRoot.js
 */

import { createContainer } from "../../../react-reconciler/src/ReactFiberReconciler"

function ReactDOMRoot(internalRoot) {
  this._internalRoot = internalRoot
}

export function createRoot(container) {
  const root = createContainer(container)
  return new ReactDOMRoot(root)
}