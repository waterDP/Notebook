
class Script {
  async exec(name, options) {
    (await require(`../lib/${name}`)) .setup(options)
  }
}

module.exports = new Script()