/**
 * 正则文法
 */
let RegExpObject = /([0-9]+)|(\+)|(\*)/g
let tokenNames = ['number', 'plus', 'multiply']

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

class TokenReader {
  constructor(tokens) {
    this.tokens = tokens
    this.pos = 0
  }
  // 读取一个token,或者说消耗丢一个token
  read(){
    if (this.pos < this.tokens.length) {
      return this.tokens[this.pos++] // 读完后pos会自增，相当于用掉了这个token
    }
    return null
  }
  peek() {
    if (this.pos < this.tokens.length) {
      return this.tokens[this.pos]
    }
    return null
  }
  // 倒退
  unread() {
    (this.pos > 0) && this.pos--
  }
}

module.exports = tokenize