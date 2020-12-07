/** 
 * 有限状态机做词法分析 
 * 正则分词
 * 递归下降做语法分析 
 */
const parse = require('./parse')
const evaluate = require('./evaluate')

const sourceCode = '5-1+4/2/2*3'

let ast = parse(sourceCode)

console.log(ast)

let result = evaluate(ast)

console.log(result)