
class OptimizePlugin {
  constructor(options) {
    this.options = options
  }
  apply(compiler) {
    // 每当compiler对象创建出来一个compilation编译对象，那么就会触发回调，参数就是这个compilation
    compiler.hooks.compilation.tap('OptimizePlugin', compilation => {
      compilation.hooks.optimize.tap('OptimizePlugin', () => {
        console.log('webpack正在优化中')
      })
    })
  }
}

module.exports = OptimizePlugin