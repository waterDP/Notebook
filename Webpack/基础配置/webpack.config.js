const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  mode: 'development', // 模式 默认有两种 production development
  entry: './src/index.js', // 入口
  output: { // 文件出口
    filename: 'bundle.[hash:8].js',  // 打包后的文件名  8位hash
    path: path.resolve(__dirname, 'build'), // 路径必须是一个绝对路径
    publicPath: 'cdnPath'
  },
  devServer: {  // 开发服务器配置
    port: 3000,
    progress: true,
    contentBase: './build',  // 静态文件夹
    compress: true
  },
  optimization: {  // 优化项
    minimizer: [  // 压缩代码
      new UglifyJsPlugin({
        cache: true,
        parallel: true,  // 并行压缩
        sourceMap: true
      }),
      new OptimizeCssAssetsWebpackPlugin()  // 压缩css
    ],
    splitChunks: {  // 分割代码块  
      cacheGroups: { // 缓存组
        common: {  //  公共的模块
          chunks: 'initial',
          minSize: 0,
          minChunks: 2
        },
        vendor: {
          priority: 1,  // 优先级
          test: /node_modules/,
          chunks: 'initial',
          minSize: 0,
          minChunks: 2
        }
      }
    }
  },
  modules: {  // loader
    rules: [
      {
        test: /\.html$/,
        use: 'html-withimg-loader'
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: {
          loader: 'file-loader',
        }
      },
      {
        test: /\.(png|jpg|gif)$/,
        // 做一个限制，当我们的图片 小于多少的时候 用base64来转化
        use: {
          loader: 'url-loader',
          options: {
            limit: 200 * 1024
          }
        }
      },
      {
        test: /\.js$/,
        use: {
          loader: 'eslint-loader', 
          options: {
            enforce: "pre" // previous 这个loader会比下一个loader先执行 
          }
        }
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: { // 用babel-loader 需要把es6->es5
            presets: [
              '@babel/preset-env'
            ],
            plugins: [
              ["@babel/plugin-proposal-decorators", {legacy: true}],
              ["@babel/plugin-proposal-class-properties", {loose: true}],
              "@babel/plugin-transform-runtime"
            ]
          }
        },
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/
      },
      // css-loader 解译@import这种语法的
      // style-loader 把css插入到head的标签中
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              insertAt: 'top'
            }
          },
          'css-loader'
        ]
      },

      /* 需要 less 和less-loader 两个组件 */
      {
        test: /\.less$/, 
        use: [
          MiniCssExtractPlugin.loader, // 抽离css文件
          'css-loader',
          'postcss-loader',  // css加前缀 -webkit-
          'less-loader'   
        ]
      },

    ]
  },
  resolve: { // 解析
    modules: [path.resolve('node_modules')],
    extensions: ['.js', '.vue', '.json', '.less'],
    mainFields: ['style', 'main'],  // 指定入口文件的目录
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  plugins: [ // 插件
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './public/index.html'),
      file: 'index.html',
      minify: {
        removeAttributeQuotes: true, // 删除html中的双引号
        collapseInlineTagWhitespace: true, // 折叠空行，即把html变成一行
      },
      hash: true
    }),
    new webpack.DefinePlugin({
      __VERSION__: JSON.stringify(appVersion),
      __FLAG__: JSON.stringify(process.env.FLAG)
    }),
    new MiniCssExtractPlugin({ // 抽离css文件
      filename: 'css/main.css'
    }),
    new webpack.ProvidePlugin({ // 在每个模块中都注入lodash 
      _: 'lodash'
    })
  ],
  externals: {
    _: 'lodash'   // 文件不会被打包
  }
}

/**
 * mini-css-extract-plugin 将css样式从文件中抽离出来
 * postcss-loader autoprefixer css样式自动加上前缀
 * babel-loader @babel/core @babel/preset-env
 * @babel/plugin-transform-runtime @babel-runtime
 * @babel/preset-react -D
 * @babel/polyfill
 * @expose-loader 暴露全局的loader内联的loader 
 * pre 前执行的loader / normal 普通loader / 内联loader / 后置loader 
 */
import $ from 'expose-loader?$!jquery'