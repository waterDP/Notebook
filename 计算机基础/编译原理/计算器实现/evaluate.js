const nodeTypes = require('./nodeTypes')

function evaluate(node) {
  let result = 0
  switch(node.type) {
    case nodeTypes.Program:
      for (let child of node.children) {
        result = evaluate(child) // child additive
      }
      break
    case nodeTypes.Additive: // 如果一个加法节点的话，如果计算结果
      result = evaluate(node.children[0]) + evaluate(node.children[1])
      break
    case nodeTypes.Minus: // 如果一个加法节点的话，如果计算结果
      result = evaluate(node.children[0]) - evaluate(node.children[1])
      break  
    case nodeTypes.Multiplicative:
      result = evaluate(node.children[0]) * evaluate(node.children[1])
      break
    case nodeTypes.Divide:
      result = evaluate(node.children[0]) / evaluate(node.children[1])
      break
    case nodeTypes.Numeric:
      result = parseFloat(node.value)
  }

  return result
}

module.exports = evaluate