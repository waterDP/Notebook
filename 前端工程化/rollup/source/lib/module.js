const MagicString = require("magic-string");
const { parse } = require("acorn");
const analyse = require("./ast/analyse");

class Module {
  constructor({ code, path, bundle }) {
    this.code = new MagicString(code);
    this.path = path;
    this.bundle = bundle;
    // ! 获取语法树 acorn
    this.ast = parse(code, {
      ecmaVersion: 8,
      sourceType: "module",
    });
    this.imports = {}; // 存放本模块同导入了的变量
    this.exports = {}; // 存放本模块同的导出的变量
    this.definitions = {}; // 存放本模块的顶级变量的定义语句是哪条
    // console.log(this.ast)
    analyse(this.ast, this.code, this);
    console.log("this.imports", this.imports);
    console.log("this.definitions", this.definitions);
    console.log(this.exports);
  }
  expandAllStatement() {
    let allStatements = [];
    this.ast.body.forEach((statement) => {
      let statements = this.expandStatement(statement);
      allStatements.push(...statements);
    });
    return allStatements;
  }
  expandStatement(statement) {
    statement._included = true;
    let result = [];
    result.push(statement);
    return result;
  }
}

module.exports = Module;
