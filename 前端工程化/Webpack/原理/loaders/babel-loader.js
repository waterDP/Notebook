const babel = require("@babel/core");
const loaderUtils = require("loader-utils");

/**
 *
 * @param {*} content 资源文件的内容，对于起始loader 只有这一个参数
 * @param {*} map 前面loader生成的source map 可以传递给后方的loader共享
 * @param {*} meta 其它需要 传给后方loader的共享信息，可自定义
 * @returns
 */
function loader(content, map, meta) {
  // this loader的上下文
  let options = loaderUtils.getOptions(this);
  let { code, map, ast } = babel.transform(content, options);
  return this.callback(null, code, map, ast);
}

module.exports = loader;
