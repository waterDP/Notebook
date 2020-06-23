let jsxCode = 'let element = <h1>hello world</h1>'
// parser 可以把源代码转成ast抽象语法树
// 转换的过程分成两个阶段 词法分析 语法分析
const OPERATOR = 'operator'
const JSX_ELEMENT = 'JSXElement'
const IDENTIFIER = 'Identifier'
const KEY_WORD = 'keyWord'
const WHITE_SPACE = 'whiteSpace'

function lexical(code) {
  const tokens = []
  for (let i = 0; i < code.length; i++) {
    let char = code.charAt(i)
    if (char === '=') {
      tokens.push({
        type: OPERATOR,
        value: char
      })
    } else if (char === '<') {
      const token = {
        type: JSX_ELEMENT,
        value: char
      }
      tokens.push(token)
      let isFirstGreaterThan = true
      for (i++; i < code.length; i++) {
        char = code.charAt(i)
        token.value += char
        if (char === '>') {
          if (isFirstGreaterThan) {
            isFirstGreaterThan = false
          } else {
            break
          }
        }
      }
    } else if (/[a-zA-Z\$\_]/.test(char)) {
      const token = {
        type: IDENTIFIER,
        value: char
      }
      tokens.push(token)
      for (i++; i < code.length; i++) {
        char = code.charAt(i)
        if (/[a-zA-Z\$\_]/.test(char)) {
          token.value += char
        } else {
          i--
          break
        }
      }
      if (token.value === 'var' || token.value === 'let') {
        token.type = KEY_WORD
      }
    } else if (/\s/.test(char)) {
      const token = {
        type: WHITE_SPACE,
        value: char
      }
      tokens.push(token)
      for (i++; i < code.length; i++) {
        char = code.charAt(i)
        if (/\s/.test(char)) {
          token.value += char
        } else {
          i--
          break
        }
      }
    }
  }
  return tokens
}

// 词法分析 
let tokens = lexical(jsxCode)
console.log(tokens)
/**
 * 语法分析 
 * 确定token之间的关系
 * 把这个token数组转成ast抽象语法树
 * [
  { type: 'keyWord', value: 'let' },
  { type: 'whiteSpace', value: ' ' },
  { type: 'Identifier', value: 'element' },
  { type: 'whiteSpace', value: ' ' },
  { type: 'operator', value: '=' },
  { type: 'whiteSpace', value: ' ' },
  { type: 'JSXElement', value: '<h1>hello world</h1>' }
]
 */ 
function parse(tokens) {
  const ast = {
    type: 'Program',
    sourceType: 'module',
    body: []
  }
  let i = 0
  let currentToken
  while(currentToken = tokens[i]) {
    if (currentToken === KEY_WORD) {
      let VariableDeclaration = {
        type: 'VariableDeclaration',
        declarations: [],
        kind: currentToken.value
      }
      i += 2
      let VariableDeclarator = {
        type: 'VariableDeclarator',
        id: {
          type: IDENTIFIER,
          name: currentToken.value
        }
      }
      VariableDeclaration.declarations.push(VariableDeclarator)
    }

    // ...
  }
}