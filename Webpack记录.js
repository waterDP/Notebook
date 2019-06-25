=>核心概念
	webpack是一个现代JavaScript应用程序的模块打包器（module bundler）。当webpack处理应用程序时，它会递归构建一个依赖
	关系图（dependency graph），其中包含应用程序包含的每个模块，然后将所有的这些模块打包成少量的bundle-通常只有一个，由浏览器加载。

	主要的组成部分包含：入口（entry）, 输出（output）, loader, 插件（plugins）。


	1. 入口（Entry）

	webpack创建应用程序所依赖的关系图（dependency graph）。图的起点被称为入口起点。入口起点告诉webpack从哪里开始，并根据依赖关系图
	确定需要打包的内容。可以将应用程序的入口认为是根上下文（contextual root）或App第一个启动文件。

	在 webpack 中，我们使用webpack配置对象（webpack configuration object）中的 entry 属性来定义入口。

	module.exports = {
		entry: './path/to/my/entry/file.js'
	}

	2.出口（Output）
	将所有的资源（assets）归拢在一起后，还需要告诉 webpack 在哪里打包应用程序。webpack 的 output 属性描述了如何处理归拢在一起的
	代码（bundled code）。

	const path = require('path');

	module.exports = {
		entry: './path/to/entry/file.js',
		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: 'my-first-webpack.bundle.js'
		}
	}

	3. Loader

	webpack 的目标是，让 webpack 聚焦于项目中的所有资源（asset），而浏览器不需要关注考虑这些（明确的说，这并不意味着所有资源（asset）
	都必须打包一起）。webpack 把每个文件（.css, .html, .scss, .jpg, .etc）都作为模块处理。然而 webpack 自身只理解 JavaScript。

	webpack loader 在文件被添加到依赖图中时，其转换为模块。
	
	在更高层面，在 webpack 的配置中 loader 有两个目标。

	[1]识别出（identify）应该被对应的 loader 进行转换（transform）的那些文件。(test 属性)
	[2]转换这些文件，从而使其能够被添加到依赖图中（并且最终添加到 bundle 中）(use 属性)

	const path = require('path');

	const config = {
		entry: './path/to/my/entry/file.js',
		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: 'my-first-webpack.bundle.js'
		},
		module: {
			rules: [
				{test: /\.txt$/, use: 'raw-loader'}
			]
		}
	}

	module.exports = config;

	4. 插件（plugins）
	然而由于loader仅在每个文件的基础上执行转换，而插件（plugins）更常用于（但不限于）在打包模块的"compilation"和"chunk"生命周期执行操作
	和自定义功能。webpack的插件系统极其强大的和可定制化。
	想要使用一个插件，你只需要require它，然后把它添加到plugins数组中。多数插件可以通过选项（option）自定义。你可以在一个配置文件中因为不
	同目的而多次使用同一个插件，这时需要通过使用new来创建它的一个实例。

	const HtmlWebpackPlugin = require('html-webpack-plugin');
	const webpack = require('webpack');
	const path = require('path');

	const config = {
		entry: './path/to/my/entry/file.js',
		output: {
			path: path.resolve(__direname, 'dist'),
			filename: 'my-first-webpack.bunld.js'
		},
		module: {
			rules: [
				{test: /\.txt$/, use:'raw-loader'}
			]
		},
		plugins: [
			new webpack.optimize.UglifyJsPlugin(),
			new HtmlWebpackPlugin({template: './src/index.html'})
		]
	} 

	module.exports = config;

	5. 模式 (Mode) 
		提供 mode 配置选项，告知 webpack 使用相应模式的内置优化。

=>入口起点（Entry Points）
	
	>>单个入口（简写）语法
	用法：entry: string|Array<string>

	const config = {
		entry: './path/to/my/entry/file.js'
	};

	module.exports = config;

	entry属性的单个入口语法，是下面的简写：
	const config = {
		entry: {
			main: './path/to/my/entry/file.js'
		}
	}

	>>对象语法
	用法：entry: {[entryChunkName:string]: string|Array<string>}

	const config = {
		entry: {
			app: './src/app.js',
			vendors: './src/vendors.js'
		}
	}

	&& 常见场景 

	>> 分离 应用程序（App）和 第三方库（vendor）入口

	const config = {
		entry: {
			app: './src/app.js',
			vendor: './src/vendor.js'
		}
	};
	从表面上看，这告诉我们 webpack从app.js 和 vendor.js开始创建依赖图（denpendency graph）。这些依赖图是彼此完全分离、互相独立的（每个
	bundle中都有一个webpack引导（bootstrap））。这种方式比较常见于，只有一个入口起点（不包括vendor）的单页应用程序（single page 
	appliction）中。 

	此设置允许你使用CommonsChunkPlugin从{应用程序bundle}中提取vendor引用（vendor reference）到vendor bundle, 并用引用vendor（vendor 
	reference）到vendor bundle，并把引用vendor的部分替换为 __webpack_require__() 调用。如果应用程序bundle中没有vendor代码，那么你可以
	在webpack中实现被称作长效缓存的通用模式。

	>> 分页面应用程序

	const config = {
		entry: {
			pageOne: './src/pageOne/index.js',
			pageTwo: './src/pageTwo/index.js',
			pageThree: './src/pageThree/index.js'
		}
	}

	我们告诉webpack需要3个独立分离的依赖图。

	在多面应用中，（译注：每当页面跳转时）服务器将为你获取一个新的HTML文档。页面重新加载新文档，并且资源被重新下载。然而，这给我们
	特殊机会去做很多事：

	> 使用CommonsChunkPlugin为每个页面间的应用程序共享代码创建bundle。由于入口起点增多，多页面能够复用入口起点之间的大量代码/模块，
	从而可以极大的从这些技术中受益。

=>输出（output）
	
	配置output选项可以控制webpack如何向硬盘写入编译文件。注意，即使可以存在多个入口起点，但只指定一个输出配置。

	>>用法（Usage）
	在webpack中配置output属性的最低要求是，将它的值设置为一个对象，包括以下两点：
	1.filename用于输出文件的文件名。
	2.目标输出目录的绝对路径。

	const config = {
		output: {
			filename: 'bundle.js',
			path: '/home/proj/public/assets'
		}
	};

	module.exports = config;

	此配置将一个单独的 bundle.js 文件输出到 /home/proj/public/assets目录中。

	>>多个入口起点
	如果配置创建多个单独的'chunk'（例如，使用多个起点或使用像CommonsChunkPlugin这样的插件），则应该使用占位符（substitution）来确保
	每个文件具有唯一名称。

	{
		entry: {
			app: './src/app.js',
			search: './src/search.js'
		},
		output: {
			filename: '[name].js',
			path: __dirname + '/dist'
		}
	}

	>>高级进阶
	以下是使用CDN和资源hash的复杂示例：
	output: {
		path: '/home/proj/cdn/assets/[hash]'
		publicPath: 'http: //cdn.example.com/assets/[hash]/'
	}


=>Loader
	
	loader用于对模块的源代码进行转换，loader可以使你在import 或 ‘加载’ 模块时预处理文件。因此，loader类似于其他构建工具'任务(task)'，并
	提供了处理前端构建步骤的强大方法。loader可以将文件从不同的语言（如TypeScript）转换为JavaScript，或将内联图像转换为data URL。loader
	甚至允许你直接在JavaScript模块中import CSS文件！

	module.exports = {
		module: {
			rules: [
				{ test: /\.css$/, use: 'css-loader' },
				{ test: /\.ts$/, use: 'ts-loader' }
			]
		}
	}

	在你的应用程序中，有三种使用loader的方式
	1.配置（推荐）：在 webpack.config.js 文件中指定loader;
	2.内联：在每个 import 语句中显式的指定loader;
	3.CLI：在shell命令中使用它们

	>> 配置 [Configuration]
	module.rules允许你在webpack配置中指定多个loader。这是展示loader的一种简明方法，并且有助于使代码变得简洁。同时让你对各个loader有个
	全局概览。

	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					{ loader: 'style-loader' },
					{
						loader: 'css-loader',
						options: {
							modules: true
						}
					}
				]
			}
		]
	}

=>插件（plugins）
	插件是webpack的支柱功能。webpack自身也是构建于，你在webpack配置的相应插件系统之上。插件的目的在于解决loader无法实现的其他事。

	>>剖析
	webpack插件是一个具有apply属性的JavaScript对象。apply属性会被webpack compiler调用，并且 compiler对象可在整个编译生命周期调用。
	function ConsoleLogOnBuildWebpackPlugin() {

	}

	ConsoleLogOnBuildWebpackPlugin.prototype.apply = function() {
		compiler.plugin('run', function(compiler, callback) {
			console.log('webpack 构建开始！！');

			callback();
		})
	}

	>>用法
	由于插件可以携带对数/选项，你必须在webpack配置中，向plugins属性传入new实例。
	根据你的webpack用法，这里有多种方式使用插件。

	配置
	const HtmlWebpackPlugin = require('html-webpack-plugin');
	const webpack = require('webpack');
	const path = require('path');

	const config = {
		entry: './path/to/my/entry/file.js',
		output: {
			filename: 'my-first-webpack.bundle.js',
			path: path.resolve(__dirname, 'dist')
		},
		module: {
			loaders: [
				{
					test: /\.(js|jsx)$/,
					use: 'babel-loader'
				}
			]
		},
		plugions: [
			new webpack.optimize.UglifyJsPlugin(),
			new HtmlWebpackPlugin({template: './src/index.html'})
		]
	}

=>配置
	>>最简单的配置
	let path = require('path');

	module.exports = {
		entry: './foo.js',
		output: {
			path: path.resovle(__dirname, 'dist'),
			filename: 'foo.bundle.js'
		}
	}
	
	const path = require('path');

	module.exports = {
		entry: "./app/entry",  // string | object | array
		entry: ["./app/entry1", "./app/entry2"],
		entry: {
			a: "./app/entry-a",
			b: ["./app/entry-b1", "./app/entry-b2"]
		},
		// 这里应用程序开始执行
		// webpack 开始打包

		output:{
			// webpack 如何输出结果的相关选项

			path: path.resolve(__dirname, 'dist'),  //string
			// 所有输出文件的目标路径
			// 必须是绝对路径（使用node.js的path模块）

			filename: "bundle.js"  //string
			filename: "[name].js"  //用于多个入口点（entry point）(出口点?)
			filename: "[chunkhash].js" //用于长效
			// [入口分块(entry chunk)]的文件名模板（出口分块？）
		
			publicPath: "/assets/" // string
			publicPath: "",
			publicPath: "https://cdn.example.com/",
			// 输出解析文件的目录，url 相对于HTML页面

			publicPath: "/assets/", // string
   	 	publicPath: "",
   		publicPath: "https://cdn.example.com/",
    	// 输出解析文件的目录，url 相对于 HTML 页面

    	library: "MyLibrary", // string,
    	// 导出库(exported library)的名称

    	libraryTarget: "umd", // 通用模块定义
      libraryTarget: "umd2", // 通用模块定义
      libraryTarget: "commonjs2", // exported with module.exports
      libraryTarget: "commonjs-module", // 使用 module.exports 导出
      libraryTarget: "commonjs", // 作为 exports 的属性导出
      libraryTarget: "amd", // 使用 AMD 定义方法来定义
      libraryTarget: "this", // 在 this 上设置属性
      libraryTarget: "var", // 变量定义于根作用域下
      libraryTarget: "assign", // 盲分配(blind assignment)
      libraryTarget: "window", // 在 window 对象上设置属性
      libraryTarget: "global", // property set to global object
      libraryTarget: "jsonp", // jsonp wrapper
    	// 导出库(exported library)的类型

    	 /* 高级输出配置（点击显示） */

	    pathinfo: true, // boolean
	    // 在生成代码时，引入相关的模块、导出、请求等有帮助的路径信息。

	    chunkFilename: "[id].js",
	    chunkFilename: "[chunkhash].js", // 长效缓存(/guides/caching)
	    // 「附加分块(additional chunk)」的文件名模板

	    jsonpFunction: "myWebpackJsonp", // string
	    // 用于加载分块的 JSONP 函数名

	    sourceMapFilename: "[file].map", // string
	    sourceMapFilename: "sourcemaps/[file].map", // string
	    // 「source map 位置」的文件名模板

	    devtoolModuleFilenameTemplate: "webpack:///[resource-path]", // string
	    // 「devtool 中模块」的文件名模板

	    devtoolFallbackModuleFilenameTemplate: "webpack:///[resource-path]?[hash]", // string
	    // 「devtool 中模块」的文件名模板（用于冲突）

	    umdNamedDefine: true, // boolean
	    // 在 UMD 库中使用命名的 AMD 模块

	    crossOriginLoading: "use-credentials", // 枚举
	    crossOriginLoading: "anonymous",
	    crossOriginLoading: false,
	    // 指定运行时如何发出跨域请求问题

	    /* 专家级输出配置（自行承担风险） */

		},
		module: {
			rules: [
				// 模块规则（配置 loader、解析器等选项）

				{
					test: /\.jsx?$/,
					include: [
						path.resolve(__dirname, "app")
					],
					exclude: [
						path.resolve(__dirname, 'app/demo-files')
					],
					// 这里是匹配条件，每个选项都接收一个正则表达式或字符串
	        // test 和 include 具有相同的作用，都是必须匹配选项
	        // exclude 是必不匹配选项（优先于 test 和 include）
	        // 最佳实践：
	        // - 只在 test 和 文件名匹配 中使用正则表达式
	        // - 在 include 和 exclude 中使用绝对路径数组
	        // - 尽量避免 exclude，更倾向于使用 include

	        issuer: {test, include, exclude},
	        // issuer 条件 （导入源）

	        enforce: "pre",
       	  enforce: "post",
        	// 标识应用这些规则，即使规则覆盖（高级选项）

        	loader: "babel-loader",
        	// 应该应用的 loader，它相对上下文解析
        	// 为了更清晰，`-loader` 后缀在 webpack 2 中不再是可选的
        	// 查看 webpack 1 升级指南。

        	options: {
          	presets: ["es2015"]
        	},
        	// loader 的可选项
	      },
	      
	      {
	        test: /\.html$/,
	        test: "\.html$"

	        use: [
	          // 应用多个 loader 和选项
	          "htmllint-loader",
	          {
	            loader: "html-loader",
	            options: {
	              /* ... */
	            }
	          }
	        ]
      	},

			]
		}
	}

