/*
 * @Author: water.li
 * @Date: 2023-04-18 22:46:48
 * @Description:
 * @FilePath: \Notebook\前端工程化\Vite\source\lib\server\middlewares\transform.js
 */

const { isJSRequest } = require("../../utils");
const send = require("../send");
const transformRequest = require("../transformRequest");

function transformMiddleware(server) {
  return async function (req, res, next) {
    if (req.method !== "GET") return next();
    // 如果请求的资源是JS的话，重写第三方模块的路径
    if (isJSRequest(req.url)) {
      const result = await transformRequest(req.url, server);
      if (result) {
        return send(req, res, result.code, "js");
      }
      return next();
    }
    return next();
  };
}

module.exports = transformMiddleware;
