const path = require('path')
module.exports  = {
  entry: './src/index.js', // 入口
  output: {   // 出口
    filename: 'build.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    contentBase: './build', // server 入口文件 
    port: 3000, // 端口号
    compress: true, // 服务器压缩
    open: true, // 自动打开浏览器
    hot: true
  }, // 开发服务器
  module: {}, // 模块的配置
  plugins: [], // 插件的配置
  mode: 'development', // 可以更改模式
  resolve: {}, // 配置解析
}

/**
 * 在webpack中如何配置开发服务器 webpack-dev-server
 * html-webpack-plugin
 */