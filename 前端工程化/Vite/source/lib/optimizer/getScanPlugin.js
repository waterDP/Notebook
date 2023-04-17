const fs = require("fs-extra");

const htmlTypesRE = /\.html$/;
const scriptModuleRE = /<script\s+type="module"\s+src\="(.+?)">/;

const { createPluginContainer } = require("../server/pluginContainer");
const resolvePlugin = require("../plugins/resolve");

/**
 * 获取esbuild扫描插件的工厂方法
 * @param {*} config 配置对象
 * @param {*} depImports 将用来存放导入的模块
 */
async function getScanPlugin(config, depImports) {
  const container = await createPluginContainer({
    plugins: [resolvePlugin(config)],
    root: config.root,
  });
  const resolve = async function (path, importer) {
    // 由插件容器进行路径解析 返回绝对路径
    return await container.resolveId(path, importer);
  };

  return {
    name: "scan", // 依赖扫描插件
    setup(build) {
      // 入口文件是index.html
      build.onResolve({ filter: htmlTypesRE }, async ({ path, importer }) => {
        const resolved = await resolve(path, importer);
        if (resolved) {
          return {
            path: resolved.id || resolved,
            namespace: "html",
          };
        }
      });
      build.onResolve({ filter: /.*/ }, async ({ path, importer }) => {
        const resolved = await resolve(path, importer);
        if (resolved) {
          const id = resolved.id || resolved;
          if (id.includes("node_modules")) {
            depImports[path] = normalizePath(id);
            return {
              path: id,
              external: true, // 表示这是一个外部模块，不需要进一步处理了
            };
          }
          return {
            path: id,
          };
        }
      });
      build.onload({ filter: htmlTypesRE, namespace: "html" }, ({ path }) => {
        // 需要把html转成js才能进行后续的处理
        const html = fs.readFileSync(path, "utf8");
        let [, src] = html.match(scriptModuleRE);
        let jsContent = `import ${JSON.stringify(src)}`; // import "/src/main.js"
        return {
          contents: jsContent,
          loader: "js",
        };
      });
    },
  };
}

module.exports = getScanPlugin;
