import Vue from 'vue'
import App from './App'

// todo 工厂函数
Vue.component('HelloWorld', resolve => {
  // 这个特殊的require语法告诉webpack
  // 自动将编译后的代码分割成不同的块
  require(['./components/HelloWorld'], resolve)
})

// todo Promise
Vue.component(
  'HelloWorld', 
  // 该import函数返回一个Promise对象
  () => import('./components/HelloWorld.vue')
)

// todo 高级异步组件
const AsyncComp = () => ({
  // 需要加载的组件。应当是一个Promise
  component: import('./components/HelloWorld.vue'),
  // 加载中应当渲染的组件
  loading: LoadingComp,
  // 出错时渲染的组件 
  error: ErrorComp,
  // 渲染加载中组件前的等待时间。默认为200ms
  delay: 200,
  // 最长等待时间。超出此时间则渲染错误组件。默认为Infinity
  timeout: 1000
})

const app = new Vue({
  el: '#app',
  render(h) {
    h(App)
  }
})