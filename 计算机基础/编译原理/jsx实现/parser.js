const tokenizer = require('./tokenizer')
const tokenTypes = require('./tokenTypes')
const nodeTypes = require('./nodeTypes')
/* 
  [
    { type: 'LeftParentheses', value: '<' },
    { type: 'JSXIdentifier', value: 'h1' },
    { type: 'AttributeKey', value: 'id' },
    { type: 'AttributeStringValue', value: 'title' },
    { type: 'RightParentheses', value: '>' },
    { type: 'LeftParentheses', value: '<' },
    { type: 'JSXIdentifier', value: 'span' },
    { type: 'RightParentheses', value: '>' },
    { type: 'JSXText', value: 'hello' },
    { type: 'LeftParentheses', value: '<' },
    { type: 'BackSlash', value: '/' },
    { type: 'JSXIdentifier', value: 'span' },
    { type: 'RightParentheses', value: '>' },
    { type: 'JSXText', value: 'world' },
    { type: 'LeftParentheses', value: '<' },
    { type: 'BackSlash', value: '/' },
    { type: 'JSXIdentifier', value: 'h1' },
    { type: 'RightParentheses', value: '>' }
  ]
*/
function parse(tokens) {
  let pos = 0 // 当前的token的索引
  function walk(parent) {
    let token = tokens[pos]
    let nextToken = tokens[pos+1]
    if (token.type === tokenTypes.LeftParentheses 
      && nextToken.type === tokenTypes.JSXIdentifier) {
      // 当前是<,下一个token是标识符，说明它就是一个元素的开始
      let node = {
        type: nodeTypes.JSXElement,
        openingElement: null,
        closingElement: null,
        children: []
      }
      // 第一步：给开始元素地赋值
      token = tokens[++pos]
      node.openingElement = {
        type: nodeTypes.JSXOpeningElement,
        name: {
          type: nodeTypes.JSXIdentifier,
          name: token.value
        },
        attributes: []
      }
      token = tokens[++pos]
      // 循环给属性数组赋值
      while (token.type === tokenTypes.AttributeKey) {
        node.openingElement.attributes.push(walk())
        token = tokens[pos]
      }
      // 属性赋值结束
      token = tokens[++pos] // 直接把>跳过去了
      nextToken = tokens[pos+1]
      // child -> JSXText|jsxElement
      while(token.type !== tokenTypes.LeftParentheses ||
        (token.type === tokenTypes.LeftParentheses && nextToken.type !== tokenTypes.BackSlash)
      ) {
        node.children.push(walk())
        token = tokens[pos]
        nextToken = tokens[pos+1]
      }
      node.closingElement = walk(node)
      return node
    } else if (token.type === tokenTypes.AttributeKey) {
      let nextToken = tokens[++pos] // value
      let node = {
        type: nodeTypes.JSXAttribute,
        name: {
          type: nodeTypes.JSXIdentifier,
          name: token.value 
        },
        value: {
          type: nodeTypes.Literal,
          value: nextToken.value
        }
      }
      pos++
      return node
    } else if (token.type === tokenTypes.JSXText) {
      pos++
      return {
        type: nodeTypes.JSXText,
        value: token.value
      }
    } else if (
      parent 
      && token.type === tokenTypes.LeftParentheses
      && nextToken.type === tokenTypes.BackSlash
    ) {
      // 处理结束标签
      // pos++  // <
      // pos++  // /
      // pos++  // span
      // pos++  // >
      pos += 2
      token = tokens[pos]
      pos += 2
      if (parent.openingElement.name.name !== token.value) {
        throw new TypeError('开始标签和结束标签不匹配')
      }
      return {
        type: nodeTypes.JSXClosingElement,
        name: {
          type: nodeTypes.JSXIdentifier,
          name: token.value
        }
      }
    }
    throw new TypeError('不可能走到这')  
  }
  let ast = {
    type: nodeTypes.Program,
    body: [
      {
        type: nodeTypes.ExpressionStatement,
        expression: walk()
      }
    ]
  }
  return ast
}

module.exports = {
  parse
}