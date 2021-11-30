<!--
 * @Author: water.li
 * @Date: 2021-01-19 22:35:28
 * @Description: ## vue3中diff的优化
 * @FilePath: \notebook\Vue\note.md
-->
## 组件通信

- props + emit / 同步数据 v-model/.sync
- provide, inject 会造成单向数据流混乱 自己实现工具类的话 需要采用这个方式
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