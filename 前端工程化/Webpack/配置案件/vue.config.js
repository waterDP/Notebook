 const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const DistToTar = require('./plugins/dist-to-tar')
const package = require('./package.json')
const BuildDockerImage = require('./plugins/build-docker-image')

class Noop {
  apply() { }
}

module.exports = {
  devServer: {
    inline: false,
    hot: false,
    proxy: {
      "/api/search": {
        target: "https://...",
      },
      '/api/cos': {
        target: 'https://api/',
        secure: true
      }
    },
  },
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = JSON.stringify(process.env.FLAG) === 'production' ? '后台' : '测试后台'
        return args
      })
  },
  configureWebpack: {
    devtool: "source-map",
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        "~": path.resolve(__dirname, "src/"),
      },
    },
    plugins: [
      new webpack.ProvidePlugin({
        _: "lodash"
      }),
      new webpack.DefinePlugin({
        __FLAG__: JSON.stringify(process.env.FLAG)
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, './public/index.html'),
        favicon: faviconPath()
      }),
      new CopyWebpackPlugin([
        {
          from: copyFilePath(),
          to: path.resolve(__dirname, 'dist')
        }
      ]),
      process.env.NODE_ENV !== 'production'
        ? new Noop()
        : new DistToTar({
          target: path.resolve(__dirname, 'dist'),
          toFilePath: path.resolve(__dirname, 'dist/dist.tar')
        }),
      process.env.NODE_ENV !== 'production'
        ? new Noop()
        : new BuildDockerImage({
          target: path.resolve(__dirname, 'dist/dist.tar'),
          imageName: imageName(),
          config: dockerConfig()
        })
    ]
  },
};

function faviconPath() {
  return (
    process.env.FLAG === 'production'
      ? path.resolve(__dirname, './src/assets/appLogo.png')
      : path.resolve(__dirname, './src/assets/test.png')
  )
}

function copyFilePath() {
  return (
    process.env.FLAG === 'production'
      ? path.resolve(__dirname, './nginx/production')
      : path.resolve(__dirname, './nginx/test')
  )
}

function dockerConfig() {
  const test = {
    host: '10.2.2.2',
    port: '2372',
    username: 'water.li',
    sshAuthAgent: 'fwiqnice'
  }
  const production = {
    host: '10.101.222.14',
    port: '2522',
    username: 'water.li',
    sshAuthAgent: 'dfashibnfdpu'
  }
  return process.env.FLAG === 'test' ? test : production
}

function imageName() {
  return process.env.FLAG === 'test' 
    ? `cms-page:${package.version}`
    : `horiews/isisi/gess/${package.version}`
}