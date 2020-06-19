module.exports = {
  // root: true, // 是否是根配置
  parser: 'babel-eslint', // 把源代码转成语法树的工具
  extends: 'airbnb',
 /*  parserOptions: { // 解析器的选项 AST语法树
    sourceType: 'module',
    ecmaVersion: 'es2015',
  }, */
  env: { // 环境
    browser: true,
    node: true
  },
  rules: {
    'indent': ['error', 4]
  }
}
