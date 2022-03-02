/*
 * @Author: water.li
 * @Date: 2022-02-25 21:35:43
 * @Description: 
 * @FilePath: \notebook\微前端原理\handleRouter.js
 */
import { importHTML } from "./importHTML";
import { getApps } from "./index";
import { getCurrRoute, getPrevRoute } from "./listenRouter";
export default async function() {
  const apps = getApps()

  // 获取上一个路由应用
  const prevApp = apps.find(item => getPrevRoute().startsWith(item.activeRule))

  // 获取下一个路由应用
  const currApp = apps.find(item => getCurrRoute().startsWith(item.activeRule))

  // 如果有上一个应用 就先销毁上一个应用
  prevApp && unmount(prevApp)

  if (!currApp) return
  
  const {template, execScripts} = importHTML(currApp.entry)
  const container = document.querySelector(currApp.container)
  container.appendChild(template)

  // 配置全局环境变量
  window.__POWERED_BY_QIANKUN__ = true

  window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ = currApp.entry + '/'
  
  // 解析文档中的script标签 并执行
  const appExport = execScripts()

  currApp.bootstrap = appExport.bootstrap
  currApp.mount = appExport.mount
  currApp.unmount = appExport.unmount

  await bootstrap(currApp)

  await mount(currApp)
}


async function bootstrap(app) {
  app.bootstrap && (await app.bootstrap())
}

async function mount(app) {
  app.mount && (await app.mount({
    container: document.querySelector(app.container)
  }))
}

async function unmount(app) {
  app.unmount && (await app.unmount({
    container: document.querySelector(app.container)
  }))
}