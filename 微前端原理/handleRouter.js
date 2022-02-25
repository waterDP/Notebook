/*
 * @Author: water.li
 * @Date: 2022-02-25 21:35:43
 * @Description: 
 * @FilePath: \notebook\微前端原理\handleRouter.js
 */
import { importHTML } from "./importHTML";
import { getApps } from "./index";
import { getNextRoute, getPrevRoute } from "./listenRouter";
export default async function() {
  const apps = getApps()

  // 获取上一个路由应用
  const prevApp = apps.find(item => getPrevRoute().startsWith(item.activeRule))

  // 获取下一个路由应用
  const nextApp = apps.find(item => getNextRoute().startsWith(item.activeRule))

  // 如果有上一个应用 就先销毁上一个应用
  prevApp && unmount(prevApp)

  if (!nextApp) return
  
  const {template, execScripts} = importHTML(nextApp.entry)
  const container = document.querySelector(nextApp.container)
  container.appendChild(template)

  // 配置全局环境变量
  window.__POWERED_BY_QIANKUN__ = true

  window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ = nextApp.entry + '/'
  
  // 解析文档中的script标签 并执行
  const appExport = execScripts()

  nextApp.bootstrap = appExport.bootstrap
  nextApp.mount = appExport.mount
  nextApp.unmount = appExport.unmount

  await bootstrap(nextApp)

  await mount(nextApp)
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