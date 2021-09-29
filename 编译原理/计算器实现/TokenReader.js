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

module.exports = TokenReader