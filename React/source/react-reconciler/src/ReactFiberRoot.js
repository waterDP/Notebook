/*
 * @Author: water.li
 * @Date: 2023-01-03 22:55:31
 * @Description:
 * @FilePath: \Notebook\React\源码\react-reconciler\src\ReactFiberRoot.js
 */
import { createHostRootFiber } from './ReactFiber'

function FiberRootNode(containerInfo) {
  this.containerInfo = containerInfo // div#root
}

export function createFiberRoot(containerInfo) {
  const root = new FiberRootNode(containerInfo)
  // HostRoot指的就是根节点 div#root
  const uninitializedFiber = createHostRootFiber()
  root.current = uninitializedFiber
  uninitializedFiber.stateNode = root
  return root
}