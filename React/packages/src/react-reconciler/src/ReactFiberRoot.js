/*
 * @Author: water.li
 * @Date: 2023-01-03 22:55:31
 * @Description:
 * @FilePath: \Notebook\React\source\src\react-reconciler\src\ReactFiberRoot.js
 */
import { createHostRootFiber } from "./ReactFiber";
import { initialUpdateQueue } from "./ReactFiberClassUpdateQueue";

function FiberRootNode(containerInfo) {
  this.containerInfo = containerInfo; // div#root
}

export function createFiberRoot(containerInfo) {
  const root = new FiberRootNode(containerInfo);
  // HostRoot指的就是根节点 div#root
  const uninitializedFiber = createHostRootFiber();
  // 根容器的current指向当前的根fiber
  root.current = uninitializedFiber;
  // 根fiber的stateNode 也就是真实的DOM节点指向FiberRootNode
  uninitializedFiber.stateNode = root;
  initialUpdateQueue(uninitializedFiber);
  return root;
}
