/*
 * @Author: water.li
 * @Date: 2023-02-26 23:02:32
 * @Description:
 * @FilePath: \Notebook\React\source\src\react-reconciler\src\ReactFiberConcurrentUpdates.js
 */
import { HostRoot } from "./ReactWorkTags";

export function markUpdateLaneFromFiberToRoot(soruceFiber) {
  let node = soruceFiber;
  let parent = soruceFiber.return;
  while (parent !== null) {
    node = parent;
    parent = parent.return;
  }
  if (node.tag === HostRoot) {
    return node.stateNode;
  }
  return null;
}
