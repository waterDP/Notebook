const {tokenizer} = require('./tokenizer')
const parser = require('./parser')
const {traverse} = require('./traverse')

let sourceCode = '<h1 id="title"><span>hello</span>world</h1>'
// 词法分析
let tokens = tokenizer(sourceCode)
// 语法树生成
let ast = parser.parse(tokens)

traverse(ast, {
  JSXOpeningElement: {
    enter(nodePath, parent) {
      console.log('进入开始元素', nodePath.node)
    },
    exit(nodePath, parent) {
      console.log('离开开始元素', nodePath.node)
    }
  }
})