/**
 * webpack 的运行是一个串行的过程，从启动到结束依次执行以下流程：
 * 1.初始化参数：从配置文件和shell语句中读取与合并参数，得出最终的参数
 * 2.开始编译：用上一步得到的对数初始化Compiler对象，加载所有配置的插件，执行对象的run方法开始执行编译
 * 3.确定入口：根据配置中的Entry找出来所有入口文件
 * 4.编译模块：从入口文件出发，调用所有配置的Loader对模块进行翻译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件者经过本步骤的处理
 * 5.完成模块编译：在经过第4步使用Loader翻译完所有的模块后，得到了每个模块翻译后的最终内容以及它们的依赖关系
 * 6.输入资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的Chunk，再把每个Chunk转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会
 * 7.输出完成：在确定好输出内容后，根据配置确定输出的内容和文件名，把文件内容写入到时文件系统。在以上过程中，Webpack会在特定的时间点广播特定的事件，插件在监听到感兴趣的事件后会执行特定的逻辑，并且插件可以调用Webpack提供的API改变webpack的运行结果
 */
/**
 * Loader 基础
 * 由于webpack是运行在node.js之上的，一个Loader其实就是一个Node.js模块，这个模块需要出出一个函数，这个导出函数，这个模块需要导出一个函数，这个导出的函数的工作就是获得处理前的原内容，对原内容执行处理后，返回处理后的内容 
 */
module.exports = source => {
  // source为compiler传递给Loader的一个文件的原内容
  // 该函数需要返回处理后的内容，这里为了起见，直接把原内容返回了，相当于该Loader没有做任务转换
  return source;
}

/**
 * 由于Loader运行在Node.js中，你可以调用任何Node.js自带的API，或者安装第三方进行调用
 */ 
const sass = require('node-sass');
module.exports = function (source) {
  return sass(source);
}

/**
 * 获得Loader的Options
 */
const loaderUtils = require('loader-utils');
module.exports = function(source) {
  // 获取到用户给当前Loader传入的Options
  const options = loaderUtils(this);
  return source;
}

/**
 * 返回其它结果
 * 上面的Loader都只会返回原内容转换后的内容，但有些场景下返回除子内容之外的内容
 * 例如用babel-loader转换ES6代码为例，它还需要输出转换后的ES5代码对就看Source Map，以方便调试源码
 * 为了把Soure Map也一起随代码返回给Webpack，可以这样写
 */
module.eports = function (source) {
  // 通过this.callback告诉webpack返回的结果
  this.callback(null, source, sourceMap);
  // 当你使用this.callback返回内容时，该loader必须返回undefined
  // 以让Webpack知道该Loader返回结果在this.callback中，而不是在return 中
  return;
}

/**
 * 其中的this.callback是webpack给loader注入的API，以方便Loader和Webpack之间通信
 * this.callback的详细使用方法如下
 */
this.callback(
  // 当无法转换原内容时，给webpack返回一个Error
  error, // <Error | null>
  // 原内容转换后的内容
  content, // <String | Buffer>
  // 用于把转换后的内容得出原内容的Source Map，方便高度
  sourceMap, // ?<SourceMap>
  // 如果本次转换为原内容生成的AST语法树，可以把这个AST返回，
  // 以方便之后需要AST的Loader利用该AST，以避免重复生成AST，提升性能
  abstractSyntaxTree  // AST
)

/** 
 * 同步与异步
 * Loader有同步和异步之分，上面介绍的Loader都是同步的Loader，因为它们的转换流程都是同步的，转换完成后再返回结果
 * 但在有些场景下转换的步骤只能是异步完成的，例如你需要通过网络请求才能得出结果，如果是采用同步的方式，网络请求就会阻塞整个构建，导致非常缓慢
 * 在转换步骤是异步时，你可以这样  
 */
module.exports = function (source) {
  // 告诉webpack本次转换是异步的，Loader会在callback中回调结果
  someAsyncOperation(source, function(err, result, sourceMaps, ast) {
    // 通过callback返回异步执行后的结果
    callback(err, result, sourceMaps, ast);
  })
}