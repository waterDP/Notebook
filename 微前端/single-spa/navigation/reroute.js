import { getAppChanges, shouldBeActive } from "../application/app.helpers";
import { toBootstrapPromise } from "../lifecycles/boostrap";
import { toLoadPromise } from "../lifecycles/load";
import { toMountPromise } from "../lifecycles/mount";
import { toUnmountPromise } from "../lifecycles/unmount";
import { started } from "../start";

import "./navigation-events.js";
import { callCaptureEventListeners } from "./navigation-events.js";

// * important
// 后续路径变化后 也需要走这里，重新计算哪些应用被加载或者卸载

let appChangeUnderWap = false;
let peopleWaitingOnChange = [];

export function reroute(event) {
  if (appChangeUnderWap) {
    return new Promise((resolve, reject) => {
      peopleWaitingOnChange.push({ resolve, reject });
    });
  }

  const { appsToLoad, appsToMount, appsToUnmount } = getAppChanges();

  function performAppChange() {
    // 将不需要的应用卸载
    const unmountAllPromises = Promise.all(appsToUnmount.map(toUnmountPromise));
    // 加载需要的应用 =》 启动对应的应用 =》 挂载对应的应用
    const loadMountPromises = Promise.all(
      appsToLoad.map((app) =>
        toLoadPromise(app).then((app) => {
          // 当应用加载完毕后，需要启动和挂载，但是要保证挂载前 先卸载丢老的应用
          return tryBoostrapAndMount(app, unmountAllPromises);
        })
      )
    );

    const mountePromises = Promise.all(
      appsToMount.map((app) => tryBoostrapAndMount(app))
    );

    return Promise.all([loadMountPromises, mountePromises]).then(() => {
      callEventListener();
      appChangeUnderWap = false;
    });
  }

  function tryBoostrapAndMount(app, unmountAllPromises) {
    if (shouldBeActive(app)) {
      // 保证先卸载完毕再挂载
      return toBootstrapPromise(app).then((app) =>
        unmountAllPromises().then(() => toMountPromise(app))
      );
    }
  }

  if (started) {
    // 用记调了start方法 我们需要处理当前应用要挂载或者卸载
    appChangeUnderWap = true;
    return performAppChange();
  }

  return loadApps();
  function loadApps() {
    return Promise.all(appsToLoad.map(toLoadPromise)).then(
      callCaptureEventListeners
    );
  }
  function callEventListener() {
    callCaptureEventListeners(event);
  }
}
