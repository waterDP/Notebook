const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
module.exports = {
  // 多入口
  entry: {
    home: './src/index.js',
    other: './src/other.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // 配置一个代理
        pathReWrite: {
          '/api': ''
        }
      }
    }
  },
  resolve: {
    
  },
  /**
   * @devtool source-map 源码映射 会单独生成一个sourcemap文件 出错了 会标识当前出错的列和行
   * @devtool eval-source-map 不会产生单独的文件但是可以显示行和列 
   * @devtool cheap-module-source-map 不会产生列，但是是一个单独的映射文件
   * @devtool cheap-module-eval-source-map 不会产生文件，集成在打包后的文件中，不产生列
   */
  devtool: 'source-map', 
  watch: true,  // 实时打包
  watchOptions: { // 监控的选项
    poll: 1000, // 每秒 轮询1000次
    aggregateTimeout: 500, // 防抖 我一直输入代码
    ignored: /node_modules/ // 不需要进行监听的文件
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'home.html',
      chunks: ['home']
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'other.html',
      chunks: ['other', 'home']
    }),
    new CleanWebpackPlugin('./dist'), // 清空dist目录，然后再打包
    new CopyWebpackPlugin([ // 拷贝插件
      {from: './doc', to: './dist'} // 将doc中的文件放入dist文件夹中
    ]),
    new webpack.BannerPlugin('make 2019 by author')
  ]
}