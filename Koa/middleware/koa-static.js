const fs = require('fs').promise
const path = require('path')

const static = (filePath) => {
  return async (ctx, next) => {
    try {
      let path = path.join(filePath, ctx.path)
      let statObj = await fs.stat(path)
      if (statObj.isFile()) {
        ctx.set('Context-Type', 'text/html;charset=utf-8')
        ctx.body = await fs.readFile(path)
      } else {
        await next()
      } 
    } catch (err) {
      await next()
    }
  }
} 

module.exports = static