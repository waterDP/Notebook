const tokenizer = require("./tokenizer")

/**
 * 正则文法
 */
let RegExpObject = /([0-9]+)|(\+)|(\*)/g
let tokenNames = ['number', 'plus', 'multiply']
function tokenize(script) {
  let result
  while(true) {
    let result = RegExpObject.exec(script)
    if (!result) break
    let index = result.findIndex((item, index)D)
    let token = {}
    token.type =
    token.value =         
  }
}

function tokenize(script) {
  let tokens = []
  for (let token of tokenizer(script)) { 
    tokens.push(token)
  }
  return tokens
}