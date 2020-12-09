const { tokenizer } = require('./tokenizer')
const parser = require('./parser')
const { transformer } = require('./transformer')
const { codeGenerator } = require('./codeGenerator')

let sourceCode = '<h1 id="title"><span>hello</span>world</h1>'
// 词法分析
let tokens = tokenizer(sourceCode)
// 语法树生成
let ast = parser.parse(tokens)

transformer(ast)

let result = codeGenerator(ast)

console.log(result)