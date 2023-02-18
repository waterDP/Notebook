/*
 * @Author: water.li
 * @Date: 2023-02-18 21:35:43
 * @Description: 为每个入口模块添加一句 import 'polyfill'
 * @FilePath: \Notebook\前端工程化\rollup\plugin\demo\rollup-plugin-inject-polyfill.js
 */

const PROXY_SUFFIX = "?inject-polyfill";
const POLLYFILL_ID = "\0polyfill";

function injectPolyfill() {
  return {
    name: "inject-polyfill", // 插件的名字
    async resolveId(source, importer, options) {
      if (source === POLLYFILL_ID) {
        return {
          id: POLLYFILL_ID,
          moduleSideEffects: true,
        };
      }
      if (options.isEntry) {
        // ? 说明这是一个入口点

        // ^ this.resolve将导入解析为模块ID（即文件名）
        const resolution = await this.resolve(source, importer, {
          skipSelf: true,
          ...options,
        });
        console.log("resolution", resolution);
        // 如果此模块无法解析 或者是外部模块 要以直接返回 rollup会报错或进行external提示
        if (!resolution || resolution.external) {
          return resolution;
        }
        const moduleInfo = await this.load(resolution); // 加载模块内容
        console.log(moduleInfo);
        // 表示此模块有副作用 不要tree shaking
        moduleInfo.moduleSideEffects = true;
        // :\\Notebook\\前端工程化\\rollup\\plugin\\src\\index.js?inject-polyfill
        return `${resolution.id}${PROXY_SUFFIX}`;
      }
      return null;
    },
    load(id) {
      if (id === POLLYFILL_ID) {
        return `console.log('腻子代码')`;
      }
      // 如果是一个需要代理的入口 特殊处理下，生成一个中间的代理模块
      if (id.endsWith(PROXY_SUFFIX)) {
        // :\\Notebook\\前端工程化\\rollup\\plugin\\src\\index.js
        const entryId = id.slice(0, -PROXY_SUFFIX.length);
        let code = `
          import ${JSON.stringify(POLLYFILL_ID)}
          export * from ${JSON.stringify(entryId)}
        `;
        return code;
      }
      return null;
    },
  };
}

export default injectPolyfill;

/**
 * resolveId 查找引入的模块的绝对路径
 * entry ./src/index
 * resolution {
 *   external: false, 是否是外部模块
 *   id: 'E:\\Notebook\\前端工程化\\rollup\\plugin\\src\\index.js', 此模块的绝对路径
 *   meta: {},
 *   moduleSideEffects: true, 模块是否有副作用，有副作用的话 禁用 tree shaking
 *   syntheticNamedExports: false
 * }
 */
