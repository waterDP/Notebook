const Application = require('./application')


function createApplication() { // 工厂
  return new Application()  // 创建一个应用
}

module.exports = createApplication