#! /usr/bin/env node 

// 1 需要找到当前执行名的路径 拿到webpack.config.js

const path = require('path')

// config配置文件
let config = require(path.resolve('webpack.config.js'))

const Compiler = require('../lib/Compiler.js')
const compiler = new Compiler(config)
compiler.hooks.entryOptions.call()
// 标识运行编译
compiler.run()