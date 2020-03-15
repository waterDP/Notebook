const path = require('path')
class P {
  apply(compiler) {
    compiler.hooks.afterPlugins.tap('emit', function() {
      console.log('emit')
    })
  }
}
module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'boundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolveLoader: {
    alias: {
      loader1: path.resolve(__dirname, 'loaders', 'loader1.js')
    },
    modules: [
      'node_modules', 
      path.resolve(__dirname, 'loaders')
    ]
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          path.resolve(__dirname, 'loader', 'style-loader'),
          path.resolve(__dirname, 'loader', 'less-loader')
        ]
      }
    ]
  },
  plugins: [
    new P()
  ]
}