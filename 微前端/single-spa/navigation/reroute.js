/*
 * @Author: water.li
 * @Date: 2023-06-06 22:41:18
 * @Description: 
 * @FilePath: \Notebook\微前端\single-spa\navigation\reroute.js
 */
import { getAppChanges, shouldBeActive } from "../application/app.helpers";
import { toBootstrapPromise } from "../lifecycles/boostrap";
import { toLoadPromise } from "../lifecycles/load";
import { toMountPromise } from "../lifecycles/mount";
import { toUnmountPromise } from "../lifecycles/unmount";
import { started } from "../start";

import { callCaptureEventListeners } from "./navigation-events.js";

// * 路由变化的时候 我们需要重新加载应用 
import "./navigation-events.js";

// * important
// 后续路径变化后 也需要走这里，重新计算哪些应用被加载或者卸载

let appChangeUnderWay = false;
let peopleWaitingOnChange = [];

export function reroute(event) {
  if (appChangeUnderWay) {
    return new Promise((resolve, reject) => {
      peopleWaitingOnChange.push({ resolve, reject });
    });
  }

  const { appsToLoad, appsToMount, appsToUnmount } = getAppChanges();

  /**
   * 尝试对应用进行启动和挂载操作
   * @param {Object} app - 需要进行启动和挂载操作的应用对象
   * @param {Promise} [unmountAllPromises] - 所有应用卸载操作完成的 Promise，可选参数
   * @returns {Promise} - 返回一个 Promise，当应用成功启动并挂载后 resolve
   */
  function tryBoostrapAndMount(app, unmountAllPromises) {
    if (shouldBeActive(app)) {
      // 保证先卸载完毕再挂载
      return toBootstrapPromise(app).then((app) =>
        unmountAllPromises().then(() => toMountPromise(app))
      );
    }
  }

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

    // 如果应用没有加载 加载-》启动-》挂载 如果应用已经加载过了 直接 启动-》挂载
    const mountPromises = Promise.all(
      appsToMount.map((app) => tryBoostrapAndMount(app))
    );

    return Promise.all([loadMountPromises, mountPromises]).then(() => {
      callEventListener();
      appChangeUnderWay = false;
    });
  }

  if (started) {
    // 用户调用了start方法 我们需要处理当前应用要挂载或者卸载
    appChangeUnderWay = true;
    return performAppChange();
  }

  return loadApps();
  function loadApps() {
    return Promise.all(appsToLoad.map(toLoadPromise))
      .then(callEventListener)
  }
  function callEventListener() {
    callCaptureEventListeners(event);
  }
}
