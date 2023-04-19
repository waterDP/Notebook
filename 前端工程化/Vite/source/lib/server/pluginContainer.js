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
  // 插件上下文类
  class PluginContext {
    async resolve(id, importer) {
      return await container.resolveId(id, importer);
    }
  }
  const container = {
    async resolveId(path, importer) {
      let resolveId = path;
      const ctx = new PluginContext();
      for (const plugin of plugins) {
        if (!plugin.resolveId) continue;
        const result = await plugin.resolveId.call(ctx, path, importer);
        if (result) {
          resolveId = result.id || result;
          break;
        }
      }
      return { id: normalizePath(resolveId) };
    },
    async load(id) {
      const ctx = new PluginContext();
      for (const plugin of plugins) {
        if (!plugin.load) continue;
        const result = await plugin.load.call(ctx, id);
        if (result) {
          return result;
        }
      }
      return null;
    },
    async transform(code, id) {
      const ctx = new PluginContext();
      for (const plugin of plugins) {
        if (!plugin.transform) continue;
        const result = await plugin.transform.call(ctx, code, id);
        if (result) {
          code = result.code || result;
        }
      }
      return { code };
    },
  };
  return container;
}

exports.createPluginContainer = createPluginContainer;
