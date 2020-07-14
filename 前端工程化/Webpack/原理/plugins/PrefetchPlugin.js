class PrefetchPlugin {
  constructor(options) {
    this.options = options
  }
  apply(compiler) {
    compiler.hooks.compilation.tap('prefetchPlugin', compilation => {
      compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync('prefetch', (htmlData, callback) => {
       /*  htmlData.head.push({
          type: 'link',
          closeTag: true,
          attributes: {ref: 'prefetch', as: 'script', href: 'bundle.js'}
        }) */
        let chunkMap = {}
        let tags = []
        compilation.chunks.forEach(chunk => {
          chunkMap[chunk.id] = chunk
        })
        compilation.chunks.forEach(chunk => {
          let prefetchChunkIds = chunk.getChildIdsByOrders().prefetch
          if (prefetchChunkIds) {
            prefetchChunkIds.forEach(prefetchChunkId => {
              let files = chunkMap[prefetchChunkId].files
              files.forEach(file => {
                let item = {
                  type: 'link',
                  closeTag: true,
                  attributes: {ref: 'prefetch', as: 'script', href: file}
                }
                tags.push(item)
              })
            })
          }
        })
        htmlData.head.push(...chunkMap)
        callback()
      })
    })
  }
}

module.exports = PrefetchPlugin

// compilation.hooks.htmlWebpackPluginAlterAssetTags