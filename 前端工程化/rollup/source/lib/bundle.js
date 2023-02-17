/*
 * @Author: water.li
 * @Date: 2023-02-04 20:27:30
 * @Description:
 * @FilePath: \Notebook\前端工程化\rollup\source\lib\bundle.js
 */
const path = require("path");
const fs = require("fs");
const MagicString = require("magic-string");
const Module = require("./module");
const { hasOwnProperty } = require("./utils");
const replaceIdentifier = require("./ast/replaceIdentifier");

class Bundle {
  constructor(options) {
    // 入口文件的绝对路径
    this.entryPath = path.resolve(options.entry.replace(/\.js$/, "") + ".js");
    this.modules = new Set();
  }
  build(output) {
    const entryModule = this.fetchModule(this.entryPath);
    this.statements = entryModule.expandAllStatements();
    this.deconflict();
    const { code } = this.generate();
    fs.writeFileSync(output, code);
  }
  deconflict() {
    const defines = {}; // 定义的变量
    const conflicts = {}; // 变量名冲突的变量
    this.statements.forEach((statement) => {
      Object.keys(statement._defines).forEach((name) => {
        if (hasOwnProperty(defines, name)) {
          conflicts[name] = true;
        } else {
          defines[name] = [];
        }
        // 把此变量定义语句对应模块放到数组里
        defines[name].push(statement._module);
      });
    });
    // 获取变量名冲突的变数组
    Object.keys(conflicts).forEach((name) => {
      const modules = defines[name];
      modules.pop(); // 最后一个模块不需要重命名，可以保留原来的变量名
      modules.forEach((module, index) => {
        let replacement = `${name}$${modules.length - index}`;
        module.rename(name, replacement);
      });
    });
  }
  generate() {
    let bundle = new MagicString.Bundle();
    // ! 遍历
    this.statements.forEach((statement) => {
      let replacements = {};
      Object.keys(statement._dependsOn)
        .concat(Object.keys(statement._defines))
        .forEach((name) => {
          const canonicalName = statement._module.getCanonicalName(name);
          if (name !== canonicalName) {
            replacements[name] = canonicalName;
          }
        });

      const source = statement._source.clone();
      // 删除export
      if (statement.type === "ExportNamedDeclaration") {
        source.remove(statement.start, statement.declaration.start);
      }

      // todo 替换重命名
      replaceIdentifier(statement, source, replacements);
      // ! 把每个语句对应的源代码都添加到bundle实例中
      bundle.addSource({
        content: source,
        separator: "\n",
      });
    });

    // ! 返回合并后的源代码
    return {
      code: bundle.toString(),
    };
  }
  /**
   * 创建模块实例
   * @param {*} importee 被引入的模块 ./msg.js
   * @param {*} importer 引入别的模块的模块 ./main.js
   * @returns
   */
  fetchModule(importee, importer) {
    let route;
    if (!importer) {
      route = importee;
    } else {
      if (path.isAbsolute(importee)) {
        // 绝对的路径
        route = importee.replace(/\.js$/, "") + ".js";
      } else {
        route = path.resolve(
          path.dirname(importer),
          importee.replace(/\.js$/, "") + ".js"
        );
      }
    }
    if (route) {
      // ! 读取文件对应的内容
      const code = fs.readFileSync(route, "utf-8");
      // ! 创建一个模块的实例
      const module = new Module({
        code,
        path: route,
        bundle: this,
      });
      this.modules.add(module);
      return module;
    }
  }
}

module.exports = Bundle;
