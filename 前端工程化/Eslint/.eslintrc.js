/*
 * @Author: water.li
 * @Date: 2024-09-08 17:56:26
 * @Description: 
 * @FilePath: \Notebook\前端工程化\Eslint\.eslintrc.js
 */
module.exports = {
  env: { // 运行环境
    browser: true,
    es2021: true,
    node: true
  },
  extends: "eslint:recommended",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  rules: {
    // 0 off  1 warn  2 error 
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