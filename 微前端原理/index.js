/*
 * @Author: water.li
 * @Date: 2022-02-25 21:20:23
 * @Description: 
 * @FilePath: \notebook\微前端原理\index.js
 */
import listenRouter from "./listenRouter"

/**
 * 1.监听路由变化
 * 2.匹配子路由
 * 3.加载子应用 
 * 4.渲染子应用
 */

let _apps = []

export const getApps = () => _apps

export function registerMicroApps(apps) {
  _apps = apps
}

export function start() {
  listenRouter()
}

