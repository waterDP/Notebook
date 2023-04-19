/*
 * @Author: water.li
 * @Date: 2023-04-08 21:19:26
 * @Description:
 * @FilePath: \Notebook\前端工程化\Vite\source\lib\server\index.js
 */
const connect = require("connect");
const serveStaticMiddleware = require("./middlewares/static");
const resolveConfig = require("../config");
const { createOptimizeDepsRun } = require("../optimizer");
const transformMiddleware = require("./middlewares/transform");
const { createPluginContainer } = require("./pluginContainer");

async function createServer() {
  const config = await resolveConfig();
  const middlewares = connect();
  const pluginContainer = await createPluginContainer(config);

  const server = {
    pluginContainer,
    async listen(port, callback) {
      // ~ 在项目启动前 进行依赖的预构建
      // 1.找到本项目依赖的第三方模板
      await runOptimize(config, server);
      require("http").createServer(middlewares).listen(port, callback);
    },
  };

  for (let plugin of config.plugins) {
    if (plugin.configureServer) {
      plugin.configureServer(server);
    }
  }

  // main.js中vue => /node_modules/.vite/deps/vue.js?v=902903
  middlewares.use(transformMiddleware(server));

  middlewares.use(serveStaticMiddleware(config));

  return server;
}

async function runOptimize(config, server) {
  const optimizeDeps = await createOptimizeDepsRun(config);
  server._optimizeDepsMetadata = optimizeDeps.metadata;
}

exports.createServer = createServer;
