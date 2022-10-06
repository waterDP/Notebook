const Compiler = require("./Compiler")

function webpack(config) {
  // 将调用webpack方法时传入的webpack.config.js中的配置 和命令行中的配置合并
  let shellOptions = process.argv.slice(2).reduce((config, args) => {
    let [key, value] = args.split('=')
    config[key.slice(2)] = value
    return config
  }, {})

  // 合并config与shell options
  const finalOptions = {...config, ...shellOptions}
  const compiler = new Compiler(finalOptions)
 
  // 插件的挂载
  finalOptions.plugins &&
    finalOptions.plugins.forEach(plugin => plugin.apply(compiler))

  return compiler
}

module.exports = webpack