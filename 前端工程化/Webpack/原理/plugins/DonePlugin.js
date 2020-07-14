class DonePlugin {
  constructor(options) {
    this.options = options
  }
  apply(compiler) {
    // 每当编译完成后，都会call done这个事件
    compiler.hooks.done.tap('DonePlugin', () => {
      console.log(this.options.message||'编译完成')
    })
  }
}

module.exports = DonePlugin

// 插件就是一个类，有一个apply方法，接收一个compiler对象
// 我们会在compiler对象的钩子上挂载一些监听函数，当compiler这个对象上的这些钩子，这些钩子触发的时候，会执行这些监听函数