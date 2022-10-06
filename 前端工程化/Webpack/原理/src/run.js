// 01 引入
const webpack = require('./webpack')

// 02 引入配置对象
const config = require('./webpack.config')

// 03 实例化compiler
const compiler = webpack(config)

// 04 调用run方法开始打包工作
compiler.run((err, stats) => {
  config.log(stats.toJson())
})