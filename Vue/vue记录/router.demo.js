import Vue from 'vue'
import VueRouter from 'vue-router'
import hooks from './router.hooks.js'

Vue.use(VueRouter)

const files = require.context('./', false, /\.router.js/)
const routers = []
files.keys().forEach(key => {
  routers.push(...files(key).default)
})

const router = new VueRouter({
  mode: 'history',
  base: process.evn.BASE_URL,
  routers
})

Object.values(hooks).forEach(hook => {
  router.beforeEach(hook.bind(router))
})

export default router