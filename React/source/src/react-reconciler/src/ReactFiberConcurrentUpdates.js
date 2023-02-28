import { HostRoot } from "./ReactWorkTags";

export function markUpdateLaneFromFiberToRoot(soruceFiber) {
  let node = soruceFiber;
  let parent = soruceFiber.return;
  while (parent !== null) {
    node = parent;
    parent = parent.return;
  }
  if ((node.tag = HostRoot)) {
    return node.stateNode;
  }
  return null;
}
