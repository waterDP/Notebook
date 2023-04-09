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

async function createServer() {
  const config = await resolveConfig();
  const middlewares = connect();
  middlewares.use(serveStaticMiddleware(config));

  const server = {
    async listen(port, callback) {
      // ~ 在项目启动前 进行依赖的预构建
      // 1.找到本项目依赖的第三方模板
      await runOptimize(config, server);
      require("http").createServer(middlewares).listen(port, callback);
    },
  };
  return server;
}

async function runOptimize(config, server) {
  const optimizeDeps = await createOptimizeDepsRun(config);
  server._optimizeDepsMetadata = optimizeDeps.metadata;
}

exports.createServer = createServer;
