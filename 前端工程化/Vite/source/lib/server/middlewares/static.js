/*
 * @Author: water.li
 * @Date: 2023-04-08 21:33:29
 * @Description: 
 * @FilePath: \Notebook\前端工程化\Vite\source\lib\server\middlewares\static.js
 */
const static = require("serve-static");

function serveStaticMiddleware({ root }) {
  return static(root);
}
module.exports = serveStaticMiddleware;
