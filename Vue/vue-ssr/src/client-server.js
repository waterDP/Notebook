/*
 * @Description: 
 * @Date: 2021-03-03 17:37:59
 * @Author: water.li
 */
import createApp from './app'

// 服务端会调用此函数 来产生一个app实例
export default function() {
  let {app} = createApp()
  return app
}