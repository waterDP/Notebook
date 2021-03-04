/*
 * @Description: 
 * @Date: 2021-03-03 17:46:10
 * @Author: water.li
 */
const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  mode: 'production',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '../dist')
  },
  modules: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              '@babel/plugin-syntax-dynamic-import'
            ]
          },
          exclude: /node_modules/
        }
      },
      {
        test: /\.css$/,
        loader: ['vue-style-loader', 'css-loader']
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ],
    plugins: [
      new VueLoaderPlugin()
    ]
  }
}