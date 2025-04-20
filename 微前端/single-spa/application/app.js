import { reroute } from "../navigation/reroute";
import { NOT_LOADED } from "./app.helpers";

export const apps = [];

/**
 * 注册一个微前端应用
 * @param {string} appName - 应用的名称，用于唯一标识该应用
 * @param {Function} loadApp - 加载应用的函数，该函数应返回一个 Promise，用于异步加载应用
 * @param {Function|string} activeWhen - 一个函数或路径字符串，用于判断应用何时处于激活状态
 * @param {Object} customProps - 传递给应用的自定义属性对象
 */
export function registerApplication(appName, loadApp, activeWhen, customProps) {
  const registeration = {
    name: appName,
    loadApp,
    activeWhen,
    customProps,
    status: NOT_LOADED,
  };
  apps.push(registeration);

  // 我们需要给每个应用添加对应的状态变化
  // 未加载 -》加载 -》挂载 -》卸载 
  // 需要检查哪些应用需要被加载，还有哪些应用要被挂载，还有哪些应用要被移除
  reroute(); // 重写路由
}
