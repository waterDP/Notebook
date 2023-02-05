const walk = require("./walk");
const Scope = require("./scope");

function analyse(ast, code, module) {
  //^ 开始第一轮循环，找出本模块内导入导出了哪些变量
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
      _defines: { value: {} },
    });

    // todo 找出导入导出了哪些变量
    if (statement.type === "ImportDeclaration") {
      // & 导入 imports
      // 获取导入的模块的相对路径
      let source = statement.source.value;
      statement.specifiers.forEach((specifier) => {
        let importName = specifier.imported.name; // 导入的变量名
        let localName = specifier.local.name; // 当前模块的变量名
        // 我当前模块内导入的变量名localName来自于source模块导出的importName变量名
        module.imports[localName] = { source, importName };
      });
    } else if (statement.type === "ExportNamedDelaration") {
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
    function addToScope(name) {
      currentScope.add(name); // 把此变量名添加到当前作用域的变量数组中
      if (!currentScope.parent) {
        // 顶级作用域
        statement._defines[name] = true;
        module.definitions[name] = statement;
      }
    }
    walk(statement, {
      enter(node) {
        if (node.type === "Identifier") {
          // 表示当前的这个语句依赖了node.name这个变量
          statement._dependsOn[node.name] = true;
        }
        let newScope;
        switch (node.type) {
          case "FunctionDeclaration":
            addToScope(node.id.name); // 把函数名添加到当前的作用域变量中
            const names = node.params.map((param) => param.name);
            newScope = new Scope({
              name: node.id.name,
              parent: currentScope,
              names,
            });
            break;
          case "VariableDeclaration":
            node.declaration.forEach((declaration) => {
              addToScope(declaration.id.name);
            });
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
