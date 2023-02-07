const MagicString = require("magic-string");
const { parse } = require("acorn");
const analyse = require("./ast/analyse");
const { hasOwnProperty } = require("./utils");
const SYSTEM_VARS = ["console", "log"];
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
    this.modifications = {}; // 存放变量修改语句
    // console.log(this.ast)
    analyse(this.ast, this.code, this);
  }
  expandAllStatement() {
    let allStatements = [];
    this.ast.body.forEach((statement) => {
      if (statement.type === "ImportDeclaration") return;
      // 默认情况下不包括所有的变量声明语句
      if (statement.type === "VariableDeclaration") return;
      let statements = this.expandStatement(statement);
      allStatements.push(...statements);
    });
    return allStatements;
  }
  expandStatement(statement) {
    statement._included = true;
    let result = [];
    // 找到此语句使用到的变量，把这些变量的定义语句取出来，放到result数组里
    const _dependsOn = Object.keys(statement._dependsOn);
    _dependsOn.forEach((name) => {
      // 找到此变量的定义语句，添加到结果中去
      let definitions = this.define(name);
      result.push(...definitions);
    });
    result.push(statement);
    // 找到此语句定义的变量，把此变量对应的修改语句也包括进来
    const defines = Object.keys(statement._defines);
    defines.forEach((name) => {
      // 找到此变量的修改语句
      const modifications =
        hasOwnProperty(this.modifications, name) && this.modifications[name];
      if (modifications) {
        modifications.forEach((modification) => {
          if (!modification._included) {
            let statements = this.expandStatement(modification);
            result.push(...statements);
          }
        });
      }
    });
    return result;
  }
  define(name) {
    // 区分此变量是函数自己声明的，还是外部导入的
    if (hasOwnProperty(this.imports, name)) {
      // console.log(this.imports);
      // 获取从那个模块引入的哪个变量
      const { source, importName } = this.imports[name];
      // 获取导入的模块 source是相对于当前模块路径的相对路径 path是当前模块的绝对路径
      const importedModule = this.bundle.fetchModule(source, this.path);
      const { localName } = importedModule.exports[importName];
      return importedModule.define(localName);
    }
    // 非导入模块  是本地模块的话 获取些变量的变量定义语句
    let statement = this.definitions[name];
    if (statement) {
      if (statement._included) {
        return [];
      }
      return this.expandStatement(statement);
    }
    if (SYSTEM_VARS.includes(name)) {
      return [];
    }
    throw new Error(`变量${name}既没有从外部导入，也没有在当前的模块内声明！`);
  }
}

module.exports = Module;
