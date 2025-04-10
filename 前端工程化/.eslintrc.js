
module.exports = {
  // 指定环境
  env: {
    // 可以使用浏览器的全局变量
    browser: true,
    es2021: true,
    node: true
  },
  // 定义全局变量
  globals: {
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly',
    localStorage: 'off', // 禁用localStorage
  },
  // vue文件解析器
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  }
}