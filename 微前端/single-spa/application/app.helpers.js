/*
 * @Author: water.li
 * @Date: 2023-06-04 22:15:52
 * @Description:
 * @FilePath: \Notebook\微前端\single-spa\application\app.helpers.js
 */
// app status

import { apps } from "./app";

export const NOT_LOADED = "NOT_LOADED"; // 没有被加载
export const LOADING_SOURCE_CODE = "LOADING_SOURCE_CODE"; //路径匹配了 要去加载这个资源
export const LOAD_ERROR = "LOAD_ERROR";

// 启动的过程
export const NOT_BOOTSTRAPED = "NOT_BOOTSTRAPED"; // 资源加载完毕了 需要启动 此时还没有启动
export const BOOTSTRAPING = "BOOTSTRAPING"; // 启动中
export const NOT_MOUNTED = "NOT_MOUNTED"; // 没有被挂载

// 挂载流程
export const MOUNTING = "MOUNTING";
export const MOUNTED = "MOUNTED";

// 卸载流程
export const UNMOUNTING = "UNMOUNTING";

// 看一下这个应用是否正在被激活
export function isActive(app) {
  return app.status === MOUNTED; // 此应用正在被激活
}

// 看一下此应用是否被激活
export function shouldBeActive(app) {
  return app.activeWhen(window.location);
}

export function getAppChanges() {
  const appsToLoad = [];
  const appsToMount = [];
  const appsToUnmount = [];

  apps.forEach((app) => {
    let appShouldBeActive = shouldBeActive();
    switch (app.status) {
      case NOT_LOADED:
      case LOADING_SOURCE_CODE:
        if (appShouldBeActive) {
          appsToLoad.push(app);
        }
        break;
      case NOT_BOOTSTRAPED:
      case BOOTSTRAPING:
      case NOT_MOUNTED:
        if (appShouldBeActive) {
          appsToMount.push(app);
        }
        break;
      case MOUNTED:
        if (!appShouldBeActive) {
          appsToUnmount.push(app);
        }
        break;
      default:
        break;
    }
  });

  return { appsToLoad, appsToMount, appsToUnmount };
}
