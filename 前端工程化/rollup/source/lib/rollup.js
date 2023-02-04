/*
* @Author: water.li
* @Date: 2023-02-04 20:17:03
* @Description: 
* @FilePath: \Notebook\前端工程化\rollup\source\lib\rollup.js
*/

const Bundle = require("./bundle")

function rollup(entry, output) {
  const bundle = new Bundle({entry})
  bundle.build(output)
}

module.exports = rollup