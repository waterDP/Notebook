const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const webpack = require('webpack')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const HtmlWebpackExternalPlugin = require('html-webpack-externals-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin') // 错误日志友好输出
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin')  // 费时分析
const {BundleAnalyzerPlugin} = require('bundle-analyzer-plugin')

const smw = new SpeedMeasureWebpackPlugin()

module.exports = smw.wrap({
  mode: 'development', // 模式 默认有两种 production development
  entry: './src/index.js', // 入口
  output: { // 文件出口
    filename: 'bundle.[hash:8].js',  // 打包后的文件名  8位hash
    path: path.resolve(__dirname, 'build'), // 路径必须是一个绝对路径
    publicPath: 'cdnPath',

    library: 'name',
    libraryTarget: 'umd|var|window|this', // 以何种方式导出
    libraryExport: 'default' // 导出哪个属性
  },
  devServer: {  // 开发服务器配置
    port: 3000,
    progress: true,
    contentBase: './build',  // 静态文件夹
    compress: true
  },
  stats: 'minimal', // 日志的输出配置
  optimization: {  // 优化项
    minimizer: [  // 压缩代码
      // new UglifyJsPlugin({
      //   cache: true,
      //   parallel: true,  // 并行压缩
      //   sourceMap: true
      // }),
      new TerserWebpackPlugin({
        parallel: true,
        sourceMap: true,
        cache: true
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
  module: {  // loader  
    noParse: /jquery|lodash/, // 配置哪些模块不需要读取并且转成语法树进行解析依赖
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
            limit: 200 * 1024,
            name: '[name]',
            // 要把图片拷贝到images目录下
            outputPath: 'images',
            publicPath: '/images'
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
        loader: 'eslint-loader',
        enforce: 'pre', // 强制提前执行
        include: path.join(__dirname, 'src'),
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
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
      // 字体文件
      {
        test: /.(ttf|svg|eot|woff|woff2|otf)$/,
        use: {
          loader: 'url-loader'
        }
      }
    ]
  },
  resolve: { // 解析
    modules: [path.resolve('node_modules')],
    extensions: ['.js', '.vue', '.json', '.less'],  // 后缀规则 
    mainFields: ['style', 'main'],  // 指定入口文件的目录
    mainFiles: [],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  resolveLoaders: {
    // 用来指定如何查找loaders
    modules: [
      path.resolve(__dirname, '/node_modules'),
      path.resolve(__dirname, './loaders')
    ],
    alias: {
      
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
      filename: 'css/[name].[contentHash].css',
      chunkFilename: '[id].css' // 在异步加载的时候用的
    }),
    new webpack.ProvidePlugin({ // 在每个模块中都注入lodash 
      _: 'lodash'
    }),
    new HtmlWebpackExternalsPlugin({
      externals: [
        {
          module: 'jquery',
          entry: 'https://cdn.bootcss.com/jquery/3.4.1/jQuery.js',
          global: 'jQuery'
        }
      ]
    }),
    new FriendlyErrorsWebpackPlugin(),
    new BundleAnalyzerPlugin()
  ],
  externals: {
    _: 'lodash'   // 文件不会被打包
  }
})

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