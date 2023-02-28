/*
 * @Author: water.li
 * @Date: 2023-01-03 22:49:57
 * @Description:
 * @FilePath: \Notebook\React\source\src\react-reconciler\src\ReactFiberReconciler.js
 */
import { createFiberRoot } from "./ReactFiberRoot";
import { createUpdate, enqueueUpate } from "./ReactFiberClassUpdateQueue";
import { scheduleUpdateOnFiber } from "./ReactFiberWorkLoop";

export function createContainer(containerInfo) {
  return createFiberRoot(containerInfo);
}

/**
 * 更新容器 把虚拟dom element变成真实DOM插入到container容器中
 * @param {*} element 虚拟DOM
 * @param {*} container Dom窗口 FiberRootNode containerInfo dir#root
 */
export function updateContainer(element, container) {
  // 获取当前的根fiber
  const current = container.current;
  // 创建更新
  const update = createUpdate();
  // 要更新的虚拟dom
  update.payload = { element };
  // 把此更新对象添加到current这个根Fiber的更新队列上去 返回根节点
  const root = enqueueUpate(current, update);
  scheduleUpdateOnFiber(root);
}
