/*
 * @Author: water.li
 * @Date: 2023-02-18 00:03:22
 * @Description:
 * @FilePath: \Notebook\前端工程化\rollup\plugin\debugger.js
 */
import { rollup } from "rollup";
import rollUpOpitions from "./rollup.config.js";

/**
 * rollup扫行的三个阶段
 */
(async function () {
  // 1. 打包阶段
  const bundle = await rollup(rollUpOpitions);
  // 2. 生成阶段
  await bundle.generate(rollUpOpitions.output);
  // 3. 写入阶段
  await bundle.write(rollUpOpitions.output);
  // 4. 关闭阶段
  await bundle.close();
})();
