/*
 * @Author: water.li
 * @Date: 2023-02-18 20:11:28
 * @Description:
 * @FilePath: \Notebook\前端工程化\babel\ast.js
 */
const esprima = require("esprima");
const estraverse = require("estraverse");
const escodegen = require("escodegen");

const code = `function ast() {
  let a = 1
}`;

// ^ 通过esprima将源代码生成ast
const ast = esprima.parse(code);
let ident = 0;
const padding = () => " ".repeat(ident);

// ^ 遍历ast语法树
estraverse.traverse(ast, {
  enter(node) {
    console.log(padding() + node.type + " enter");
    ident += 2;
    if (node.type === "FunctionDeclaration") {
      node.id.name = "newAst";
    }
  },
  leave(node) {
    ident -= 2;
    console.log(padding() + node.type + " leave");
  },
});

// ^ 代码生成
const genCode = escodegen.generate(ast);
console.log(genCode);
