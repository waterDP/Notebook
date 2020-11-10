/** 
 * 分词 
 * 有限状sj vi态j
 */
const tokens = []

const NUMBERS = /[0-9]/

const Numeric = 'Numeric'
const Punctuator = 'Punctuator'

/** 
 * start表示开始状态函数
 * 它是一个函数，接收一个字符，返回下一个状态函数 
 */
let currentToken

// 确定一个新的token
function emit(token) {
  tokens.push(token)
}

function start(char) {
  if (NUMBERS.test(char)) {  // 如果这个char是一个数字的话
    currentToken = {type: Numeric, value: ''}
  }
  // 进入新状态 -- 收集捕获Number状态
  return number(char)
}

function number(char) {
  if (NUMBERS.test(char)) {  // 如果这个char是一个数字的话
    currentToken.value += char
    return number
  } else if (char === '+' || char === '-') {
    emit(currentToken)
    emit({type: Punctuator, value: char})
    currentToken = {type: Numeric, value: ''}
    return number
  }
}


function tokenizer(input) {
  let state = start
  for (let char of input) {
    state = state(char)
  }
  currentToken.value && emit(currentToken)
}

tokenizer('10+20')
console.log(tokens)