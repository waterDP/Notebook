const fs = require('fs')
const handlebars = require('handlebars')
const chalk = require('chalk')

module.exports = async() => {
  // 获取列表
  const list = fs.readdirSync('./src/views')
    .filter(v => v !== 'Home.vue')
    .map(v => ({
      name: v.replace('.vue', '').toLowerCase(),
      file: v
    }))
  
  // 生成路由定义
  compile({list}, './src/router.js', './router.js.hbs')

  // 生成菜单 
  compile({list}, './src/App.js', './App.js.hbs')

  /**
   * 模块编译
   * @param {*} meta 数据定义     
   * @param {*} filePath 目标文件
   * @param {*} templatePath 模板文件
   */
  function compile(meta, filePath, templatePath) {
    if (fs.existSync(templatePath)) {
      const template = fs.readFileSync(templatePath).toString()
      const result = handlebars.compile(template)(meta)
      fs.writeFileSync(filePath, result)
      console.log(chalk.green(`${filePath}创建成功`))
    }
  }
}