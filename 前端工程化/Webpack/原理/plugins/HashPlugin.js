/*
 * @Description: 
 * @Date: 2021-02-01 09:46:12
 * @Author: water.li
 */

class HashPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('HashPlugin', (compilation) => {
      compilation.hooks.afterHash.tap('HashPlugin', () => {
        // webpack把hash值放在了compilation.hash属性上
        compilation.hash = 'hash'
        let chunks = compilation.chunks
        for (let chunk of chunks) {
          // 每个代码的hash计算结果会放在chunk.renderHash属性里
          chunk.renderedHash = chunk.name + '_chunkHash'
          // 每个代码的contentHash就放在chunk.contentHash这个属性里
          chunk.contentHash = {'javascript': 'contentHash'}
        }
      })
    })
  }
}

module.exports = HashPlugin
