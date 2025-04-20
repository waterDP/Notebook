/*
 * @Author: water.li
 * @Date: 2025-04-20 09:00:01
 * @Description: 
 * @FilePath: \Notebook\微前端\emp\config\index.js
 */
const path = require('path')
const webpack = require('webpack')
const WebpackChain = require('webpack-chain')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

function processDefault(empConfig) {
  const devServer = empConfig.server || {}
  delete empConfig.server

  const mfOptions = {
    fileName: 'emp.js',
    ...empConfig.empShare
  }
  delete empConfig.empShare

  return {
    context: process.cwd(), // 项目根目录
    mode: 'development', // 开发模式
    devtool: false,
    devServer,
    plugin: {
      html: {
        plugin: HtmlWebpackPlugin, // 生成html文件
        args: [
          {
            template: path.resolve(__dirname, '../template/index.html')
          }
        ]
      },
      // 模块联邦
      mf: {
        plugin: webpack.container.ModuleFederationPlugin, // 模块联邦插件
        args: [mfOptions]
      }
    },
    module: {
      rule: {
        compile: {
          test: /\.js$/,
          exclude: [/node_modules/],
          use: {
            'babel-loader': {
              loader: require.resolve('babel-loader'),
              options: {
                presets: [
                  require.resolve('@babel/preset-env'),
                  require.resolve('@babel/preset-react')
                ]
              }
            }
          }
        }
      }
    },
    ...empConfig
  }
}

exports.getConfig = () => {
  const chain = new WebpackChain()
  const empConfigPath = path.resolve(process.cwd(), 'emp.config.js')
  const empConfig = require(empConfigPath)
  const afterConfig = processDefault(empConfig)
  chain.merge(afterConfig)
  return chain.toConfig()
}

