const nodeTypes = require('./nodeTypes')
const ASTNode = require('./ASTNode')
const tokenTypes = require('./tokenTypes')

/**
 * additive -> minus|minus + additive 包括+
 * minus -> multiple|multiple - minus 包括-
 * multiple -> divide|divide - multiple 包括*
 * divide -> primary|primary / divide 包括/
 * primary ->  NUMBER | (additive) 基础规则
 */
function toAST(tokenReader) {
  let rootNode = new ASTNode(nodeTypes.Program)

  // 开始推导
  let child = additive(tokenReader)
  child  && rootNode.appendChild(child)
  return rootNode
}

function additive(tokenReader) {
  let child1 = minus(tokenReader)
  let node = child1
  let token = tokenReader.peek() // 看看下一个符号是不是加号
  if (child1 && token) {
    if (token.type === tokenTypes.PLUS) { // 如果后面是加号的话
      token = tokenReader.read()
      let child2 = additive(tokenReader)
      if (child2) {
        node = new ASTNode(nodeTypes.Additive)
        node.appendChild(child1)
        node.appendChild(child2)
      }
    } 
  }
  return node
}

function minus(tokenReader) {
  let child1 = multiple(tokenReader)
  let node = child1
  let token = tokenReader.peek() // 看看下一个符号是不是减号
  if (child1 && token) {
    if (token.type === tokenTypes.MINUS) { // 如果后面是减号的话
      token = tokenReader.read()
      let child2 = minus(tokenReader)
      if (child2) {
        node = new ASTNode(nodeTypes.Minus)
        node.appendChild(child1)
        node.appendChild(child2)
      }
    }
  }
  return node
}


function multiple(tokenReader) {
  let child1 = divide(tokenReader)
  let node = child1
  let token = tokenReader.peek()
  if (child1 && token) {
    if (token.type === tokenTypes.MULTIPLY) {
      token = tokenReader.read()
      let child2 = multiple(tokenReader)
      if (child2) {
        node = new ASTNode(nodeTypes.Multiplicative)
        node.appendChild(child1)
        node.appendChild(child2)
      }
    }
  }
  return node
}

function divide(tokenReader) {
  let child1 = primary (tokenReader)
  let node = child1
  let token = tokenReader.peek()
  if (child1 && token) {
    if (token.type === tokenTypes.DIVIDE) {
      token = tokenReader.read()
      let child2 = divide(tokenReader )
      if (child2) {
        node = new ASTNode(nodeTypes.Divide)
        node.appendChild(child1)
        node.appendChild(child2)
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