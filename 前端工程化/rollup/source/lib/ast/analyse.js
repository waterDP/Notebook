/**
 * 分析模块对应的ast语法树
 * @param {*} ast 语法树
 * @param {*} code 源代码
 * @param {*} module 模块实例 
 */
function analyse(ast, code, module) {
  ast.body.forEach((statement) => {
    Object.defineProperties(statement, {
      // 指向他自己的模块
      _module: { value: module },
      // 指向他自己的源代码
      _source: { value: code.snip(statement.start, statement.end) }
    })
  })
}

module.exports = analyse