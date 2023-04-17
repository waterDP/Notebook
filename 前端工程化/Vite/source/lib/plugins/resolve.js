/*
 * @Author: water.li
 * @Date: 2023-04-09 11:17:42
 * @Description:
 * @FilePath: \Notebook\前端工程化\Vite\source\lib\plugins\resolve.js
 */
const pathLib = require("path");
const resolve = require("resolve");
const fs = require("fs-extra");
// 既是一个vite插件 也是一个rollup插件
function resolvePlugin({ root }) {
  return {
    name: "resolve",
    resolveId(path, importer) {
      if (path.startsWith("/")) {
        // 如果path以/开头，说明它是一个根目录下的绝对路径
        return { id: pathLib.resolve(root, path.slice(1)) };
      }
      if (path.isAbsolute(path)) {
        // 如果path是一个绝对路径
        return { id: path };
      }
      if (path.startsWith(".")) {
        // 如果是一个相对路径
        const baseDir = importer ? pathLib.dirname(importer) : root;
        const fsPath = pathLib.resolve(baseDir, path);
        return { id: fsPath };
      }
      // 如果是第三方
      let res = tryNodeResolve(path, importer, root);
      if (res) return res;
    },
  };
}

function tryNodeResolve(path, importer, root) {
  const pkgPath = resolve.sync(`${path}/package.json`, { baseDir: root });
  const pkgDir = pathLib.dirname(pkgPath);
  const pkg = JSON.parse(fs.readFileSync(pkgDir));
  const entryPoint = pkg.module;
  const entryPointPath = path.join(pkgDir, entryPoint);
  return { id: entryPointPath };
}

module.exports = resolvePlugin;
