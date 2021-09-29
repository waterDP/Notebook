/**
 * 有限状态机
 */

const LEFTERS = /[a-z0-9]/
const tokens = []
const {
  LeftParentheses,
  RightParentheses,
  JSXIdentifier,
  AttributeKey,
  AttributeStringValue,
  JSXText,
  BackSlash
} = require('./tokenTypes')

let currentToken = {type: '', value: ''}

function emit(token) {
  tokens.push(token)
  currentToken = {type: '', value: ''}
}

function start(char) {
  if (char === '<') {
    emit({type: LeftParentheses, value: '<'})
    return foundLeftParentheses // 找到左括号
  }   
  throw new Error('第一字符必须是<')
}

function foundLeftParentheses(char) { // char = 1
  if (LEFTERS.test(char)) { // 如果char是一个小写字母的话
    currentToken.type = JSXIdentifier
    currentToken.value += char
    return jsxIdentifier // 继续收集标识符
  } else if (char === '/') {
    emit({type: BackSlash, value: '/'})
    return foundLeftParentheses
  }
  throw new Error('第一字符必须是<')
}

function jsxIdentifier(char) {
  if (LEFTERS.test(char)) { // 如果是小写字母或者是数字的话 
    currentToken.value += char
    return jsxIdentifier
  } else if (char === ' ') { // 如果在收集标识符的过程中遇到了空格，说明标识符结果了 
    emit(currentToken)
    return attribute
  } else if (char === '>') { // 说明此标签没有属性，直接结束了
    emit(currentToken)
    emit({type: RightParentheses, value: '>'})
    return foundRightParentheses
  }
  throw new Error('第一字符必须是<')
}

function attribute(char) {
  if (LEFTERS.test(char)) {
    currentToken.type = AttributeKey
    currentToken.value += char
    return attributeKey
  }
  throw new TypeError('Error')
}

function attributeKey(char) {
  if (LEFTERS.test(char)) {
    currentToken.value += char
    return attributeKey
  } else if (char === '=') { // 说明这个属性的名已经结束了
    emit(currentToken)
    return attributeValue
  }
  throw new TypeError('Error')
}

function attributeValue(char) {
  if (char === '\"' || char === '\'') {
    currentToken.type = AttributeStringValue
    currentToken.value = ''
    return attributeStringValue // 开始读字符串属性值 
  }
}

function attributeStringValue(char) {
  if (LEFTERS.test(char)) {
    currentToken.value += char
    return attributeStringValue
  } else if (char === '\"') { // 说明字符串的值
    emit(currentToken)
    return tryLeaveAttribute
  }
}

// 因为后面可能是一个新的属性, 也可能是开始标签的结束
function tryLeaveAttribute(char) {
  if (char === ' ') { // 如果后面是这空格的话，说明后面是一个新属性
    return attributeValue
  } else if (char === '>') { // 说明该结束了
    emit({type: RightParentheses, value: '>'})
    return foundRightParentheses
  }
  throw new TypeError('Error')
}

function foundRightParentheses(char) {
  if (char === '<') {
    emit({type: LeftParentheses, value: '<'})
    return foundLeftParentheses // 找到左括号  
  } else if (char === '/') {
    emit({type: BackSlash, value: '/'})
    return foundLeftParentheses
  } else {
    currentToken.value += char
    currentToken.type = JSXText
    return jsxText
  }
}

function jsxText(char) {
  if (char === '<') {
    emit(currentToken)
    emit({type: LeftParentheses, value: '<'})
    return foundRightParentheses
  } else {
    currentToken.value += char
    return jsxText
  }
}

function tokenizer(input) {
  let state  = start
  for(let char of input) {
    state && (state = state(char))
  }
  return tokens
}

module.exports = {
  tokenizer
}