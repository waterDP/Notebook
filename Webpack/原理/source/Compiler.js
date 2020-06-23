const {Tapable, SyncHook, SyncBailHook, AsyncParallelHook, AsyncSeriesHook} = require('tapable')
const Compilation = require('./Compilation')
const Stats = require('./Stats')
const NormalModuleFactory = require('./NormalModuleFactory')
const Compilation = require('./Compilation')

class Compiler extends Tapable {
  constructor(context) {
    super()
    this.options = {}
    this.context = context
    this.hooks = {
      environment: new SyncHook([]), // todo 设置一些环境信息
      afterEnvironment: new SyncHook([]), // todo 设置环境信息完成
      entryOptions: new SyncBailHook(['context', 'entry']), // todo 处理入口 
      make: new AsyncParallelHook(['compilation']), // todo 开始编译事件
      beforeRun: new AsyncSeriesHook(['compiler']), // todo 运行前
      run: new AsyncSerriesHook(['compiler']), // todo 运行
      beforeCompile: new AsyncSeriesHook(['params']), // todo 编译前
      compile: new SyncHook(['params']), // todo 编译
      thisCompilation: new SyncHook(['compilation', 'params']), // todo 创建一个新的compilation
      compilation: new SyncHook(['compilation', 'params']), // todo 创建compilation成功
      done: new AsyncSeriesHook(['stats']) // todo 完成所有的工作
    }
  }
  run(finalCallback) { // 完成编译后执行这个finallyCallback回调
    const onCompiled = (err, compilation) => {
      const stats = new Stats(compilation)
      finalCallback(err, stats)
    }
    this.hooks.beforeRun.callAsync(this, err => {
      this.hooks.run.callAsync(this, err => {
        this.compile(onCompiled)
      })
    })
  }
  compile(onCompiled) {
    const params = this.newCompilationParams()
    this.hooks.beforeCompile.callAsync(params, err => {
      this.hooks.compile.call(params)
      const compilation = this.newCompilation(params)
      this.hooks.make.callAsync(compilation, err => {
        onCompiled(null, compilation)
      })
    })
  }
  newCompilation(params) {
    const compilation = new Compilation(this)
    this.hooks.thisCompilation.call(compilation, params)
    this.hooks.compilation.call(compilation, params)
    return compilation
  }
  newCompilationParams() {
    const params = {
      normalModuleFactory: new NormalModuleFactory()
    }

    return params
  }
}

module.exports = Compiler