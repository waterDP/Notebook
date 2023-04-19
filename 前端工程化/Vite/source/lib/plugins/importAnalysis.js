const { init, parse } = require("es-module-lexer");
const MagicString = require("magic-string");

function importAnalysis(config) {
  const { root } = config;
  return {
    name: "importAnalysis",
    // ~ 找到源文件中第三方模块进行转换 vue=> deps/vue.js
    async transform(source, importer) {
      await init; // 等特解析器初始化完成
      // 获取导入的模块
      let imports = parse(source)[0];
      // 如果没有导入任何模块 直接返回
      if (!imports.length) {
        return;
      }
      const ms = new MagicString(source);
      // url = vue => /node_modules/.vite/deps/vue.js
      const normalizeUrl = async (url) => {
        const resolved = await this.resolve(url, importer);
        if (resolved && resolved.id.startsWith(root)) {
          url = resolved.id.slice(root.length);
        }
        return url;
      };
      // 重写路径
      for (let index = 0; index < imports.length; index++) {
        const { s: start, e: end, n: specifier } = imports[index];
        if (specifier) {
          const normalizedUrl = await normalizeUrl(specifier);
          if (specifier !== normalizedUrl) {
            ms.overwrite(start, end, normalizedUrl);
          }
        }
      }
      return ms.toString();
    },
  };
}

module.exports = importAnalysis;
