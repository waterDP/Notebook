/*
 * @Description: 路由配置
 * @Date: 2021-03-04 09:33:20
 * @Author: water.li
 */
import Vue from 'vue'
import Router from 'vue-router'

import Bar from '../components/Bar'
import Foo from '../components/Foo'

Vue.use(Router)

export default function() {
  let router = new Router({
    mode: 'history',
    routes: [
      {path: '/', component: Bar},
      {path: '/foo', component: Foo}
    ]
  })
  return router
}