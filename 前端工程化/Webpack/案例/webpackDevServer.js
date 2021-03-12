/*
 * @Description: 
 * @Date: 2021-03-10 09:37:36
 * @Author: water.li
 */

/* 在启动node的时候，启动webpack服务 */
const webpack = require('webpack')
const webpackConfig = require('/path/to/your/config')

const compiler = webpack(webpackConfig)

compiler.run((err, stats) => {/* 处理结果 */})
// or
compiler.watch({
  // watch options
}, (err, stats) => {
  // 处理错误
})

// 我是把webpack打包到内存中
const MemoryFS = require('memory-fs')
const mfs = new MemoryFS()
compiler.outputFileSystem = mfs
/* 
  memory-fs是一个在内存中存储读取文件的文件系统类库，他的api和nodejs默认的fs一模一样，所以直接
  给compiler.outputFileSystem之后，所有webpack输出的文件都将存储在内存里面。
 */

// todo 通过nodejs 启动webpack-dev-server
const express = require('express')
const devMiddleware = require('webpack-dev-middleware')
const hotMiddleware = require('webpack-hot-middleware')
const webpack = require('webpack')
const webpackConfig = require('/path/to/your/config')

const app = express()
const compiler = webpack(webpackConfig)

app.use(devMiddleware(compiler, {/* dev config */}))
app.use(hotMiddleware(compiler))