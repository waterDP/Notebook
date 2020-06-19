const webpack = require('webpack')
const config = require('./webpack.config.js')

let compiler = webpack(config)
compiler.run((err, stats) => {
  console.log(err)
  console.log(stats)
})