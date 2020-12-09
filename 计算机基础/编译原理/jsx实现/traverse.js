const nodeTypes = require('./nodeTypes')
function replace(parent, oldNode, newNode) {
  if (parent) {
    for (const key in parent) {
      if (parent.hasOwnProperty(key)) {
        if (parent[key] === oldNode) {
          parent[key] = newNode
        }
      }
    }
  }
}

function traverse(ast, visitor) {
  function traverseArray(array, parent) {
    array.forEach(child => traverseNode(child, parent))
  }
  function traverseNode(node, parent) {
    let replaceWith = replace.bind(null, parent, node)
    let method = visitor[node.type]
    // Babel
    // 当开始准备遍历子节点的时候执行进入方法
    if (method) {
      if (typeof method === 'function') {
        method({node, replaceWith}, parent)
      } else {
        method.enter({node, replaceWith}, parent)
      }
    }
    switch(node.type) {
      case nodeTypes.Program:
        traverseArray(node.body, node)
        break
      case nodeTypes.ExpressionStatement:
        traverseNode(node.expression, node)  
        break
      case nodeTypes.JSXElement:
        traverseNode(node.openingElement, node)
        traverseArray(node.children, node)
        traverseNode(node.closingElement, node)
        break
      case nodeTypes.openingElement:
        traverseNode(node.name, node)  
        traverseArray(node.attributes, node)
        break
      case nodeTypes.JSXAttribute:
        traverseNode(node.name, node)
        traverseNode(node.value, node)
        break
      case nodeTypes.JSXClosingElement:
        traverseNode(node.name, node)
        break
      case nodeTypes.JSXIdentifier:  
      case nodeTypes.JSXText:
      case nodeTypes.Literal:
        break
      default: 
        break
    }
    // 当遍历结束之后执行结束方法
    if (method && method.exit) {
      method.exit({node, replaceWith}, parent)
    }
  }
  traverseNode(ast)
}

module.exports = {
  traverse
}

/*
  traverse(ast, {
    JSXOpeningElement: {
      enter(nodePath, parent) {
        console.log('进入开始元素', nodePath.node)
      },
      exit(nodePath, parent) {
        console.log('离开开始元素', nodePath.node)
      }
    }
  })
*/