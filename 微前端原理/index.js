/*
 * @Author: water.li
 * @Date: 2022-02-25 21:20:23
 * @Description: 
 * @FilePath: \notebook\微前端原理\index.js
 */
import handleRouter from "./handleRouter"
import listenRouter from "./listenRouter"


let _apps = []

export const getApps = () => _apps

export function registerMicroApps(apps) {
  _apps = apps
}

export function start() {
  listenRouter()
}

