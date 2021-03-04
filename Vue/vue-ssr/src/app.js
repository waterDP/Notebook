/*
 * @Description: 
 * @Date: 2021-03-03 17:03:50
 * @Author: water.li
 */
import Vue from 'vue'
import App from './App'

export default function() {
  let app = new Vue({
    render: h => h(App)
  })
  return {app}
}