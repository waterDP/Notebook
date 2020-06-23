const {Tapable, SyncHook, SyncBailHook, AsyncParallelHook, AsyncSeriesHook} = require('tapable')

class Compilation extends Tapable {
  constructor(compiler) {
    super()
    this.compiler = compiler
    this.options = compiler.options
    this.context = compiler.options.context
    this.inputSystem = compiler.options.inputFileSystem
    this.outputSystem = compiler.options.outputFileSystem
    this.entries = [] // 入口模块
    this.modules = [] // 本次编译产生的所有模块
    this.chunks = [] // 本次编译产出的代码块
    this.assets = [] // 本次产出的所有资源
    this.hooks = {
      succeedModule: new SyncHook(['module']), // todo 当一个模块编译完成后会触发这个钩子 
    }
  }
  // 编译入口模块
  // 转换成AST语法树
  // 解析它的依赖模块
  // 编译它的依赖模块
  addEntry(context, entry, name, callback) {
    
  }
}

module.exports = Compilation