/*
 * @Author: water.li
 * @Date: 2025-04-19 22:56:45
 * @Description: 
 * @FilePath: \Notebook\微前端\emp\cli\index.js
 */

class Script {
  async exec(name, options) {
    (await require(`../lib/${name}`)).setup(options)
  }
}

module.exports = new Script()