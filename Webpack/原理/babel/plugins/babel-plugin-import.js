const babel = require('babel/core')
const t = require('babel-types')

const visitor = {
  ImportDeclaration: {
    // path是捕获路径 state是状态对象 opts是你传给babel插件的选项 {"library": "lodash"}
    enter(path, state) {
      let node = path.node
      let specifiers = node.specifiers
      let source = node.source
      if (state.opts.library === source.value && t.isImportDefaultSpecifier(specifiers[0])) {
        let declaration = specifiers.map(specifier => {
          let importDefaultSpecifier = t.importDefaultSpecifier(specifier.local)
          t.importDeclaration([importDefaultSpecifier], t.stringLiteral(`${source.value}/${specifier.imported.name}`))
        })
        path.replaceWithMultiple(declaration)
      }
    }
  }
}

module.exports = function() {
  return {visitor}
}