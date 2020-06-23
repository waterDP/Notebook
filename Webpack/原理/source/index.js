const path = require('path')
const Compiler = require('./compiler')
const NodeEnvironmentPlugin = require('./NodeEnvironmentPlugin')
const WebpackOptionsApply = require('./WebpackOptionsApply')

const webpack = options => {
  // 设置根目录
  options.context = options.context || process.cwd()
  const compiler = new Compiler(options.context)
  compiler.options = options
  new NodeEnvironmentPlugin().apply(compiler) // 设置input output FileSystem
  // 加载用户配置的自定义插件
  if (options.plugins && Array.isArray(options.plugins)) {
    for (const plugin in options.plugins) {
      plugin.apply(compiler)
    }
  }
  compiler.hooks.environment.call()
  compiler.hooks.afterEnvironment.call()
  new WebpackOptionsApply().process(options, compiler)
  return compiler
}

module.exports = webpack