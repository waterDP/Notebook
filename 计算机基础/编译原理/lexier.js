/** 
 * 分词 
 * 状态机
 */
const tokens = []

const NUMBERS = /[0-9]/

/** 
 * start表示开始状态函数
 * 它是一个函数，接收一个字符，返回下一个状态函数 
 */
let currentToken
function start(char) {
  if (NUMBERS.test(char)) {
    currentToken = {type: 'Number', value: ''}
  }
  // 进入新状态
  return number(char)
}

function number(char) {
  
}


function tokenizer(input) {
  let state = start
  for (let char of input) {
    state = state(char)
  }
}

tokenizer('10+20')


