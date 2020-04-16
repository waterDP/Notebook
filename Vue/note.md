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

## webpack 主要就是打包文件用的

- 模块规范也是node中的语法 

- webpack(核心打包) webpack-cli(解析命令行参数)
- webpack-dev-server (在开发环境下帮助我们提供一个开发环境 支持更新)
- babel-loader (webpack 和babel的一个桥梁) @babel/core(babel的核心模块) @babel/preset-env(可以把高级语法转换成es5语法)
- vue-style-loader(vue解析样式，插入到页面中) css-loader
- vue-loader vue-template-compiler
- html-webpack-plugin