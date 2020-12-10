const nodeTypes = require('./nodeTypes')
const ASTNode = require('./ASTNode')
const tokenTypes = require('./tokenTypes')

/**
 * additive -> multiple|multiple [+ -] additive 包括 + -
 * multiple -> primary|primary [* /] multiple 包括 * /
 * primary ->  NUMBER | (additive) 基础规则
 */
/**
 * 我们用扩展的巴科斯范式来表示方法
 * *正则表达式，表示0个或多个
 * additive -> multiple (+ multiple)*
 * multiple -> number (* number)*
 */
function toAST(tokenReader) {
  let rootNode = new ASTNode(nodeTypes.Program)

  // 开始推导
  let child = additive(tokenReader)
  child && rootNode.appendChild(child)
  return rootNode
}

// additive -> multiple (+ multiple)*
function additive(tokenReader) {
  let child1 = multiple(tokenReader)
  let node = child1
  if (child1) {
    while (true) {
      let token = tokenReader.peek() // 看看下一个符号是不是加号或减号
      if (token && 
        (token.type === tokenTypes.PLUS || token.type === tokenTypes.MINUS)) { // 如果后面是加号或减号的话
        token = tokenReader.read()
        let child2 = multiple(tokenReader)
        node = new ASTNode(token.type === tokenTypes.PLUS ? nodeTypes.Additive : nodeTypes.Minus)
        node.appendChild(child1)
        node.appendChild(child2)
        child1 = node
      } else {
        break
      }
    }
  }
  return node
}

function multiple(tokenReader) {
  let child1 = primary(tokenReader)
  let node = child1
  if (child1) {
    while (true) {
      let token = tokenReader.peek() // 看看下一个符号是不是乘号或除号
      if (token && 
        (token.type === tokenTypes.MULTIPLY || token.type === tokenTypes.DIVIDE)) { // 如果后面是乘号或除号的话
        token = tokenReader.read()
        let child2 = primary(tokenReader)
        node = new ASTNode(token.type === tokenTypes.MULTIPLY ? nodeTypes.Multiplicative : nodeTypes.Divide)
        node.appendChild(child1)
        node.appendChild(child2)
        child1 = node
      } else {
        break
      }
    }
  }
  return node
}

function primary(tokenReader) {
  let node = number(tokenReader)
  if (!node) {
    let token = tokenReader.peek()
    if (token && token.type === tokenTypes.LEFT_PARA) {
      tokenReader.read()
      node = additive(tokenReader)
      tokenReader.read()
    }
  }
  return node
}

function number(tokenReader) {
  let node = null
  let token = tokenReader.peek() // 看看当前的token是啥
  //  如果能取出token,并且token的类型是数字的话,匹配上了
  if (token && token.type === tokenTypes.NUMBER) {
    token = tokenReader.read() // 读取并消耗掉这个token
    // 创建一个新的语法树节点，类型是Numeric,值是2
    node = new ASTNode(nodeTypes.Numeric, token.value)
  }
  return node
}

module.exports = toAST