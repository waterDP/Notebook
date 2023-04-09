const scanImports = require("./scan");

/**
 * 分析项目依赖的第三方模块
 * @param {*} config
 */
async function createOptimizeDepsRun(config) {
  const deps = await scanImports(config);
  console.log(deps);
}

exports.createOptimizeDepsRun = createOptimizeDepsRun;
