const WebpackDevServer = require('webpack-dev-server')
const webpack = require('webpack')
const { getConfig } = require('../config')

class DevServer {
  
  async setup() {
    await this.startServer()
  }

  async startServer() {
    const config = getConfig()
    const compiler = webpack(config)
    this.server = new WebpackDevServer(config.devServer, compiler)
    this.server.start()
  }
}

module.exports = new DevServer()