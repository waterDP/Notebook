/*
 * @Description: 
 * @Date: 2021-07-13 16:41:07
 * @Author: water.li
 */
const fs = require('fs').promises
const _7z = require('7zip-min')
const path = require('path')

class DistToTarPlugin {
  constructor({target, toFilePath}) {
    this.target = target
    this.toFilePath = toFilePath
  }
  apply(compiler) {
    compiler.hooks.done.tapAsync('distToTar', (_, cb) => {
      fs.readdir(this.target).then(res => {
        const files = res.map(item => path.resolve(this.target, item))
        _7z.cmd(['a', this.toFilePath, ...files], cb)
      })
    })
  }
}

module.exports = DistToTarPlugin

/* 
  new DistToTar({
    target: path.resolve(__dirname, 'dist'),
    toFilePath: path.resolve(__dirname, 'dist/dist.tar')
  })
 */
