/*
 * @Description: 
 * @Date: 2021-03-03 17:37:59
 * @Author: water.li
 */
import createApp from './app'

// 服务端会调用此函数 来产生一个app实例
export default function(context) {
  return new Promise((resolve, reject) => {
    let {app, router, store} = createApp()
    router.push(context.url) // 跳转到路由

    /** 
     * 需要把当前页面中配置到的组件，找到他的async
    */
    
    // !为了防止路由中的异步逻辑，所有采用promise形式，等待路由加载完成后，返回vue实例
    router.onReady(() => {
      // 获取当前路径配置到的组件
      let matchedComponents = router.getMatchedComponents()
      Promise.all(matchedComponents.map(component => {
        if (component.asyncData) {
          return component.asyncData({store})
        }
      })).then(() => {
        // 把vuex中的状态，挂载在上下文中的state上
        context.state = store.state
        context.meta = app.$meta()
        // 会自动在window上挂载一个属性__INITIAL_STATE__
        resolve(app)
      })
    })
  })
}