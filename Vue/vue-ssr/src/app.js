/*
 * @Description: 
 * @Date: 2021-03-03 17:03:50
 * @Author: water.li
 */
import Vue from 'vue'
import App from './App'
import createRouter from './router'

export default function() {
  let router = createRouter()
  let app = new Vue({
    router,
    render: h => h(App)
  })
  return {app, router}
}