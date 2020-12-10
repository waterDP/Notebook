/** 
 * 有限状态机做词法分析 
 * 正则分词
 * 递归下降做语法分析 
 */
const parse = require('./parse')
const evaluate = require('./evaluate')

const sourceCode = '4/2/2'

let ast = parse(sourceCode)

let result = evaluate(ast)

console.log(result)