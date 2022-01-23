<!--
 * @Author: water.li
 * @Date: 2021-01-19 22:35:28
 * @Description: ## vue3中diff的优化
 * @FilePath: \notebook\Vue\vue记录\note.md
-->
## 组件通信

- props + emit / 同步数据 v-model/.sync
- provide, inject inject的数据会丢失响应，可以用Vue.computed进行封装 会造成单向数据流混乱 自己实现工具类的话 需要采用这个方式
- (尽量不要直接更改父组件数据) 
- $parent $children 可以直接触发儿子的事件或者父亲的事件 （尽量不要使用）
- $broadcast $dispatch
- $attr $listener 表示所有属性和方法的合集 (inheritAttrs: false) 可以使用v-bind 或者 v-on传递
- ref
- eventBus 可以任意组件中通信 只适合小规模的 通信  大规模会导致事件不好维护
- slot 插槽的用法  slot-scope 数据插槽

## vue中模块渲染的优先级为 el < template < render

## webpack 主要就是打包文件用的

- 模块规范也是node中的语法 

- webpack(核心打包) webpack-cli(解析命令行参数)
- webpack-dev-server (在开发环境下帮助我们提供一个开发环境 支持更新)
- babel-loader (webpack 和babel的一个桥梁) @babel/core(babel的核心模块) @babel/preset-env(可以把高级语法转换成es5语法)
- vue-style-loader(vue解析样式，插入到页面中) css-loader
- vue-loader vue-template-compiler
- html-webpack-plugin

vue3中的setup函数是在beforeCreate之前调用的
setup函数只能是同步的，不能是异步的
composition api
ref 基本数据的响应式
reactive  复杂数据类型的响应式
isRef
isReactive
shallowRef 非递归监听
shallowReactive
triggerRef
toRaw 取出原始数据
markRaw
toRef
toRefs
customRef
readonly

## vue3中diff的优化
  1. 事件优化：将事件缓存，可以理解为变成静态的了
  2. 添加静态标记：vue2是全量Diff，vue3是静态标记+非全量Diff
  3. 静态提升：创建静态节点时保存，后续直接复用
  4. 使用最长增长子序列优化了对比流程

## vue 自定义指令
一个指令的定义可以提供如下几个钩子函数
  .bind 只调用一次，指令第一次绑定到元素调用。在这里可以进行一次初始化设置
  .inserted 被绑定元素插入父节点时调（仅保证父节点存在，但不一定已被插入到文档中）
  .update 所有组件的VNode更新时调用，但可能发生在其子Vnode更新之前。指令的值可能发生改变，也可能没有  
  .componentUpdated 指令所在组件的vnode及其子vnode全部更新后调用
  .unbind 只调用一次，指令与元素解绑时调用
```js 
  Vue.directive('demo', {
    bind(el, bind, vnode, oldVnode) {
      /**
       * el 指令所绑定的元素，可以用来直接操作DOM
       * bind 一个对象，包含以下property
       *   name 指令名，不包括v-部分
       *   value 指令的绑定值，例如v-my-directive="1+1",绑定值为2
       *   oldValue 指令绑定的前一个值，只在update和componentUpdated钩子中可用
       *   express 字符串形式的指令表达式。使用v-my-directive="1+1"中，表达式为'1+1'
       *   arg 传给指令的参数，可选。例如v-my-directive:foo中，参数为'foo'
       *   modifiers 一个包含修饰符的对象。例如：v-my-directive.foo.bar中，修饰对象为{foo: true,  bar: true}
       * vnode Vue编译生成虚拟节点。
       * oldVnode 上一个虚拟节点，仅在update和componentUpdated钩子中可用。
       */
    }
  })
```

## vue-router 守卫
一、全局守卫
  router.beforeEach
  router.beforeResolve  在导航被确认之前，同时在所有组件内守卫和异步路由组件被解析之后，解析守卫被调用
  router.afterEach
二、路由独享守卫
  {
    path: '',
    component: '',
    beforeEnter: (to, from, next) => {}
  }
三、组件内的守卫
  {
    beforeRouteEnter(to, from, next) {
      
    },
    beforeRouteUpdate (to, from, next) {
      
    },
    beforeRouteLeave (to, from, next) {
       
    }
  }