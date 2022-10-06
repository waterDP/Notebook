/*
 * @Author: water.li
 * @Date: 2022-10-06 15:26:47
 * @Description: 
 * @FilePath: \note\前端工程化\Webpack\原理\src\webpack.config.js
 */
const path = require('path')
const RunPlugin = require('./plugins/runPlugin')
const DonePlugin = require('./plugins/donePlugin')

module.exports = {
  mode: 'development',
  devtool: false,
  entry: './src/index.js',
  output: {
    filename: '[name].js',
    path: path.resolve('dist')
  },
  plugins: [
    new RunPlugin(),
    new DonePlugin()
  ]
}