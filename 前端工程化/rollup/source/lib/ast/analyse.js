const walk = require("./walk");
const Scope = require("./scope");
const { hasOwnProperty } = require("../utils");

/**
 * 分析模块对应的语法树
 * @param {*} ast 语法树
 * @param {*} code 源代码
 * @param {*} module 模块的实例
 */
function analyse(ast, code, module) {
  // ^ 开始第一轮循环，找出本模块内导入导出了哪些变量
  ast.body.forEach((statement) => {
    Object.defineProperties(statement, {
      // 表示这条语句默认不包括在输出结果里
      _included: { value: false, writable: true },
      // 指向他自己的模块
      _module: { value: module },
      // 指向他自己的源代码
      _source: { value: code.snip(statement.start, statement.end) },
      // 依赖的变量
      _dependsOn: { value: {} },
      _defines: { value: {} }, // 存放本语句定义了哪些变量
      _modifies: { value: {} }, // 存放本语句修改了哪些变量
    });

    // todo 找出导入导出了哪些变量
    if (statement.type === "ImportDeclaration") {
      // ~ 导入 imports
      // 获取导入的模块的相对路径
      let source = statement.source.value;
      statement.specifiers.forEach((specifier) => {
        let importName = specifier.imported.name; // 导入的变量名
        let localName = specifier.local.name; // 当前模块的变量名
        // 我当前模块内导入的变量名localName来自于source模块导出的importName变量名
        module.imports[localName] = { source, importName };
      });
    } else if (statement.type === "ExportNamedDeclaration") {
      // & 导出 exports
      const declaration = statement.declaration;
      if (declaration && declaration.type === "VariableDeclaration") {
        const declarations = declaration.declarations;
        declarations.forEach((variableDeclarator) => {
          const localName = variableDeclarator.id.name;
          const exportName = localName;
          module.exports[exportName] = { localName };
        });
      }
    }
  });

  // ^ 开始第二轮循环 创建作用域链
  // 需要知道本模块以用到了哪些变量，用到了变量留下，没有用到的就不管了
  // 创建顶级作用域
  let currentScope = new Scope({ name: "模块内的顶级作用域" });
  ast.body.forEach((statement) => {
    function addToScope(name, isBlockDeclaration) {
      currentScope.add(name, isBlockDeclaration); // 把此变量名添加到当前作用域的变量数组中
      if (
        !currentScope.parent || // 如果当前没有父作用域了，说明它就是顶级作用域了
        // * 如果当前的作用域（BlockStatement）是块级作用域，并且变量声明不是块级声明 var
        (currentScope.isBlock && !isBlockDeclaration)
      ) {
        // 表示此语句定义了一个顶级变量
        statement._defines[name] = true;
        module.definitions[name] = statement;
      }
    }
    function checkForReads(node) {
      if (node.type === "Identifier") {
        // 表示当前的这个语句依赖了node.name这个变量
        statement._dependsOn[node.name] = true;
      }
    }
    function checkForWrites(node) {
      function addNode(node) {
        const { name } = node;
        statement._modifies[name] = true; // 表示此语句修改了name这个变量
        if (!hasOwnProperty(module.modifications, name)) {
          module.modifications[name] = [];
        }
        // 存放此变量对应的所有的修改语句
        module.modifications[name].push(statement);
      }
      if (node.type === "AssignmentExpression") {
        addNode(node.left);
      } else if (node.type === "UpdateExpression") {
        addNode(node.argument);
      }
    }
    walk(statement, {
      enter(node) {
        checkForReads(node);
        checkForWrites(node);
        let newScope;
        switch (node.type) {
          case "FunctionDeclaration":
            addToScope(node.id.name); // 把函数名添加到当前的作用域变量中
            const names = node.params.map((param) => param.name);
            newScope = new Scope({
              name: node.id.name,
              parent: currentScope,
              names,
              isBlock: false, // 函数创建的不是一个块级作用域
            });
            break;
          case "VariableDeclaration":
            node.declarations.forEach((declaration) => {
              if (node.kind === "let" || node.kind === "const") {
                addToScope(declaration.id.name, true);
              } else {
                addToScope(declaration.id.name);
              }
            });
            break;
          case "BlockStatement":
            newScope = new Scope({ parent: currentScope, isBlock: true });
            break;
        }
        if (newScope) {
          Object.defineProperty(node, "_scope", { value: newScope });
          currentScope = newScope;
        }
      },
      leave(node) {
        // 如果当前节点有一个_scope说明它当前节点创建了scope 离开此节点的时间要退回到父作用域
        if (Object.hasOwnProperty(node, "_scope")) {
          currentScope = currentScope.parent;
        }
      },
    });
  });
}

module.exports = analyse;
