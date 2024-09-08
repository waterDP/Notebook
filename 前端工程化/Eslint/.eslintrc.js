module.exports = {
  "env": { // 运行环境
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "rules": {
    // 0 off  1 warn  2 error 
  },
  "parser": "esprima",
  "globals": {
    "custom": "readonly"
  }
}