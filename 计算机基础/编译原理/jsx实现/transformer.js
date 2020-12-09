const nodeTypes = require('./nodeTypes')
const { traverse } = require('./traverse')

class t {
  static nullLiteral() {
    return { type: nodeTypes.NullLiteral }
  }
  static stringLiteral(value) {
    return {
      type: nodeTypes.StringLiteral,
      value
    }
  }
  static identifier(name) {
    return {
      type: nodeTypes.Identifier,
      name
    }
  }
  static objectExpression(properties) {
    return {
      type: nodeTypes.ObjectExpression,
      properties
    }
  }
  static property(key, value) {
    return {
      type: nodeTypes.Property,
      key,
      value
    }
  }
  static callExpression(callee, _arguments) {
    return {
      type: nodeTypes.CallExpression,
      callee,
      arguments: _arguments
    }
  }
  static memberExpression(object, property) {
    return {
      type: nodeTypes.MemberExpression,
      object,
      property
    }
  }
  static isJSXElement(node) {
    return node.type === nodeTypes.JSXElement
  }
  static isJSXText(node) {
    return node.type === nodeTypes.JSXText
  }
}

function transformer(ast) {
  traverse(ast, {
    JSXElement(nodePath, parent) {
      // 传入一个JSXElement语法树节点，返回一个方法调用的新节点
      function transform(node) {
        if (!node) return t.nullLiteral()
        if (t.isJSXElement(node)) {  // 如果要转换的元素是一个jsx元素的话
          let memberExpression = t.memberExpression(
            t.identifier('React'),
            t.identifier('createElement')
          )
          let elementType = t.stringLiteral(node.openingElement.name.name)
          let attributes = node.openingElement.attributes
          let objectExpression
          if (attributes.length) {
            objectExpression = t.objectExpression(attributes.map(attr => (
              t.property(t.identifier(attr.name.name), t.stringLiteral(attr.value.value))
            )))
          } else {
            objectExpression = t.nullLiteral()
          }
          let _arguments = [elementType, objectExpression, ...node.children.map(child => transform(child))]
          return t.callExpression(memberExpression, _arguments)
        } else if (t.isJSXText(node)) {  // 要转换的节点是一个文件节点
          return t.stringLiteral(node.value)
        }
      }
      let newNode = transform(nodePath.node)
      nodePath.replaceWith(newNode)
    }
  })
}

module.exports = { transformer }