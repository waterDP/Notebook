/**
 * 正则文法
 */
const TokenReader = require('./TokenReader')

let RegExpObject = /([0-9]+)|(\+)|(-)|(\*)|(\/)|(\()|(\))/g
let tokenTypes = require('./tokenTypes')
let tokenNames = [
  tokenTypes.NUMBER,
  tokenTypes.PLUS,
  tokenTypes.MINUS,
  tokenTypes.MULTIPLY,
  tokenTypes.DIVIDE,
  tokenTypes.LEFT_PARA,
  tokenTypes.RIGHT_PARA
] 

function* tokenizer(script) {
  while(true) {
    let result = RegExpObject.exec(script)
    if (!result) break
    // 这里返回的匹配项的索引
    let index = result.findIndex((item, index) => (index >0 && !!item))
    let token = {}
    token.type = tokenNames[index -1]
    token.value = result[0] // 第一项就是匹配的内容，后面的是分组的信息
    yield token
  }
}

function tokenize(script) {
  let tokens = []
  for (let token of tokenizer(script)) { 
    tokens.push(token)
  }
  return new TokenReader(tokens)
}

module.exports = tokenize