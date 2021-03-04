/*
 * @Description: 
 * @Date: 2021-03-03 17:37:59
 * @Author: water.li
 */
import createApp from './app'

// 服务端会调用此函数 来产生一个app实例
export default function(context) {
  return new Promise((resolve, reject) => {
    let {app, router} = createApp()
    router.push(context.url) // 跳转到路由
    
    // !为了防止路由中的异步逻辑，所有采用promise形式，等待路由加载完成后，返回vue实例
    router.onReady(() => {
      resolve(app)
    })
  })
}