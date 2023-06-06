import { NOT_LOADED } from "./app.helpers";

export const apps = [];

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
}
