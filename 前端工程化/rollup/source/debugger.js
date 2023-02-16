/*
 * @Author: water.li
 * @Date: 2023-02-04 20:17:44
 * @Description:
 * @FilePath: \Notebook\前端工程化\rollup\source\debugger.js
 */
const path = require("path");
const rollup = require("./lib/rollup");
const entry = path.resolve(__dirname, "src/main.js");
const output = path.resolve(__dirname, "dist/bound.js");

rollup(entry, output);
