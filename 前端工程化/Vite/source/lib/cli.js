/*
 * @Author: water.li
 * @Date: 2023-04-08 21:11:12
 * @Description:
 * @FilePath: \Notebook\前端工程化\Vite\source\lib\cli.js
 */
const { createServer } = require("./server");
(async function () {
  const server = await createServer();
  server.listen(9999, () => {
    console.log("server started");
  });
})();
