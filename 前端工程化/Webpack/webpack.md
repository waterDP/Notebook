# webpack

## 打包流程

1.初始化参数：从配置文件和 shell 语句中读取与合并参数，得出最终的参数 2.初始化编译：用上一步得到的参数初始化 Compiler 对象，注册插件并传入 Compiler 实例（挂载了众多 webpack 事件 api 供插件调用）
3.AST&依赖图：用入口文件（entry）出发，调用 AST 引擎（acorn）生成抽象语法树 AST，根据 AST 引擎（acorn）生成抽象语法树 AST，根据 AST 构建模块的所有依赖。 4.递归编译模块：调用所有配置的 Loader 对模块进行编译 5.输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表，这步是可以修改内容的最后机会。 6.输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统

## webpack 三种类型的 hash

1.hash
hash 是跟整个项目的构建相关，只要项目里有文件更改，整个项目构建的 hash 值都会更改，并且全部文件都共用相同的 hash 的值。
即使文件没有做“任何修改”，hash 值也会改变，无法达到缓存的目的

2.chunkhash
chunkhash 它根据不同的入口文件进行依赖文件解析、构建对应的 chunk 生成对应的哈希值
简单来说这种是根据不同入口来配置的，比如 vue-router/vuex/vue 等公共入口文件，只要这些没有改变，那么他对应生成的 js 的 hash 值也不会改变

3.contenthash
contenthash 主要是处理关联性，比如一个 js 文件中引入 css，但是会生成一个 js 文件，一个 css 文件，但是因为入口是一个，导致他们的 hash 值也相同，所以当只有 js 修改时，关联输入的 css、img 等文件的 hash 值，这种情况下就需要 contenthash 了

## webpack 常用 loader

source-map-loader

## webpack 常用插件

HtmlWebpackPlugin

```js
new HtmlWebpackPlugin({
  template: path.resolve(__dirname, "./public/index.html"),
  file: "index.html",
  minify: {
    removeAttributeQuotes: true, // 删除html中的双引号
    collapseInlineTagWhitespace: true, // 折叠空行，即把html变成一行
  },
  hash: true,
});
```

CleanWebpackPlugin 每次打包时，先清除 dist 目录

webpack.SourceMapDevToolPlugin() 精细控制 sourceMap

```js
new webpack.SourceMapDevToolPlugin({
  append: "//# sourceMappingURL=http://127.0.0.1:8081/[url]",
  filename: "[file].map",
});
```

webpack.definePlugin 定义全局变量

```js
new webpack.DefinePlugin({
  __VERSION__: JSON.stringify(appVersion),
  __FLAG__: JSON.stringify(process.env.FLAG),
});
```

webpack.ProviderPlugin 全局注入插件

```js
new webpack.ProvidePlugin({
  // 在每个模块中都注入lodash
  _: "lodash",
  $: "jquery",
});
```

HtmlWebpackExternalsPlugin 引入库，但不用 webpack 打包

```js
new HtmlWebpackExternalsPlugin({
  externals: [
    {
      module: "jquery",
      entry: "https://cdn.bootcss.com/jquery/3.4.1/jQuery.js",
      global: "jQuery",
    },
  ],
});
```

AutoExternalPlugin 外链引入库(webpack-auto-external)

```js
new AutoExternalPlugin({
  externals: {
    lodash: {
      url: "https://xxx.cdn.com/lodash.js",
      varName: "_",
    },
    vant: {
      url: "https://xxx.cdn.com/vant.js",
      varName: "Vant",
      css: "https://xxx.cdn.com/vant.css",
    },
  },
});
```

BundleAnalyzerPlugin 分析代码块大小

```js
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
new BundleAnalyzerPlugin();
```
