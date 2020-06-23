class Stats {
  constructor(compilation) {
    this.entries = compilation.entries // todo 放着所有的入口模块
    this.modules = compilation.modules // todo 所有的模块
    this.chunks = compilation.chunks // todo 所有的代码块
  }
  toJson() {
    return this
  }
}

module.exports = Stats