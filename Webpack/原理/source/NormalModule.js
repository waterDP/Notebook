class NormalModule {
  /** 
   * @param name 名字 对应的入口名字
   * @param context 项目根目录
   * @param rawRequest 原始的模块路径
   * @param resource 此模块的绝对路径
   * @param parser AST解析器
   */
  constructor({name, context, rawRequest, resource, parser}) {
    this.name = name
    this.context = context
    this.rawRequest = rawRequest
    this.resource = resource
    this.parser = parser
    this._source = null
    this._ast = null
  }
}

module.exports = NormalModule