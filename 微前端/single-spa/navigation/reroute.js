import { getAppChanges } from "../application/app.helpers";
import { toLoadPromise } from "../lifecycles/load";
import { toUnmountPromise } from "../lifecycles/unmount";
import { started } from "../start";

// * important
// 后续路径变化后 也需要走这里，重新计算哪些应用被加载或者卸载
export function reroute() {
  const { appsToLoad, appsToMount, appsToUnmount } = getAppChanges();

  function performAppChange() {
    // 将不需要的应用卸载
    const unmountPromise = Promise.all(appsToUnmount.map(toUnmountPromise));
    // 加载需要的应用 =》 启动对应的应用 =》 挂载对应的应用
    
  }

  if (started) {
    // 用记调了start方法 我们需要处理当前应用要挂载或者卸载
    return performAppChange();
  }

  appsToLoad.map(toLoadPromise);
}
