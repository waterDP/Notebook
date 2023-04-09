/*
 * @Author: water.li
 * @Date: 2023-04-09 10:53:59
 * @Description:
 * @FilePath: \Notebook\前端工程化\Vite\source\lib\server\pluginContainer.js
 */

const { normalizePath } = require("../utils");

/**
 * 创建插件的容器
 * @param {*} plugins 插件的数组 它的格式和rollup插件是一样的{name, resolveId}
 * @returns
 */
async function createPluginContainer({ plugins }) {
  const container = {
    async resolveId(path, importer) {
      let resolveId = path;
      for (const plugin of plugins) {
        if (!plugin.resolveId) continue;
        const result = await plugin.resolveId.call(null, path, importer);
        if (result) {
          resolveId = result.id || result;
          break;
        }
      }
      return { id: normalizePath(resolveId) };
    },
    load() {},
    transform() {},
  };
  return container;
}

exports.createPluginContainer = createPluginContainer;
