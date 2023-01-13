/*
 * @Author: water.li
 * @Date: 2023-01-03 22:49:57
 * @Description:
 * @FilePath: \Notebook\React\源码\react-reconciler\src\ReactFiberReconciler.js
 */
import { createFiberRoot } from "./ReactFiberRoot"

export function createContainer(containerInfo) {
  return createFiberRoot(containerInfo)
}