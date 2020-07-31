const fs = require('fs').promise
const path = require('path')
const mime = require('mime')

const static = root => {
  return async (ctx, next) => {
    try {
      let filePath = path.join(root, ctx.path)
      let statObj = await fs.stat(filePath)
      if (statObj.isFile()) {
        ctx.type = mime.getType(filePath) + '; charset=utf8 '
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