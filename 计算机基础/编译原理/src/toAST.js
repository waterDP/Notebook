const nodeTypes = require('./nodeTypes')
const ASTNode = require('./ASTNode')

function toAST(tokenReader) {
  let rootNode = new ASTNode(nodeTypes.Program)

  // 开始推导
  let child = additive(tokenReader)
  child  && rootNode.appendChild(child)
  return rootNode
}

function additive(tokenReader) {
  let child1 = multiple(tokenReader)
}


function multiple(tokenReader) {
  let child1 = number(tokenReader)
}

function number(tokenReader) {
  let node = null
  let token = tokenReader.peek() // 看看当前的token是噻
  //  如果能取出token,并且token的类型是数字的话,匹配上了
  if (token && token.type === 'number') {
    token = tokenReader.read() // 读取并消耗掉这个token
    
  }
}

module.exports = toAST