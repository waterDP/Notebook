const fs = require("fs-extra");

/**
 * 转换请求
 * @param {*} url 请求的资源 /src/main.js
 * @param {*} server
 */
async function transformRequest(url, server) {
  // resolveId 获取 /src/main.js的绝对路径
  const { pluginContainer } = server;
  const id = await pluginContainer.resolveId(url);
  const loadResult = await pluginContainer.load(id);
  let code;
  if (loadResult) {
    code = loadResult.code;
  } else {
    code = await fs.readFile(id, "utf-8");
  }
  const result = pluginContainer.transform(code, id);
  return result;
}

module.exports = transformRequest;
