
class SingleEntryPlugin {
  constructor(context, entry, name) {
    this.context = context
    this.entry = entry
    this.name = name
  }
  apply(compiler) {
    compiler.hooks.make.tapAsync(
      'SingleEntryPlugin',
      // compilation是每次启动新的编译就会创建对象
      // callback是一个回调函数，当整个入口里的所有模块都编译完成才会调用callback
      (compilation, callback) => {
        const {context, entry, name} = this
        compilation.addEntry(context, entry, name, callback)
      }  
    )
  }
}
module.export = SingleEntryPlugin