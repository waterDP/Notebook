/*
 * @Author: water.li
 * @Date: 2022-02-25 21:24:11
 * @Description: 监听路由变化
 * @FilePath: \notebook\微前端原理\listenRouter.js
 */

import handleRouter from "./handleRouter"

/* 
  hash路由 window.onhashchange
  history路由
    1. history.go history.back history.forward 使用onPopState事件
    2. pushState replaceState 需要通过函数重写的方式来进行劫持
*/

let prevRoute = ''  // 上一个路由
let nextRoute = window.location.pathname // 下一个路由

export const getPrevRoute = () => prevRoute

export const getNextRoute = () => nextRoute

export default function() {
  handleRouter() // 初始化的时间也处理一下handleRouter

  window.addEventListener('popstate', () => {
    prevRoute = nextRoute
    nextRoute = window.location.pathname
    handleRouter()
  })

  const rawPushState = window.history.pushState
  window.history.pushState = (...args) => {
    // 导航前
    prevRoute = window.location.pathname
    rawPushState.apply(window.history, args)
    // 导航后
    nextRoute = window.location.pathname
    handleRouter()
  } 

  const rawReplaceState = window.history.replaceState
  window.history.replaceState = (...args) => {
    // 导航前
    prevRoute = window.location.pathname
    rawReplaceState.apply(window.history, args)
    // 导航后
    nextRoute = window.location.pathname
    handleRouter()
  }
}
