const chalk = require('chalk')
const colors = ['red', 'green', 'yellow', 'blue', 'cyan']
function getRandomColor() {
  const index = Math.random() * colors.length
  return chalk[colors[index]]
}
function debug(name) {
  return function(...args) {
    const start = Date.now()
    const {DEBUG} = process.env
    if (DEBUG.includes('*')) {
      if (DEBUG === name) {
        console.log.apply(console.log, [getRandomColor()(name), ...args, getRandomColor()(`+${Date.now() - start}ms`)])
      }
    } else {
      DEBUG = DEBUG.replace('*', '\w*')
      let reg = new RegExp(DEBUG)
      if (reg.test(name)) {
        console.log.apply(console.log, [getRandomColor()(name), ...args, getRandomColor()(`+${Date.now() - start}ms`)])
      }
    }
  }
}

module.exports = debug