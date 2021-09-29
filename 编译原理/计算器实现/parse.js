const tokenize = require('./tokenize')
const toAST = require('./toAST')

function parse(script) {
  // 把代码进行分词处理
  let tokenReader = tokenize(script)
  let ast = toAST(tokenReader)
  return ast
}

module.exports = parse 