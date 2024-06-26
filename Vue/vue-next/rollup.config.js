/*
 * @Author: water.li
 * @Date: 2022-04-08 00:30:15
 * @Description:
 * @FilePath: \Notebook\Vue\vue-next\rollup.config.js
 */
import path from "path";
import ts from "rollup-plugin-typescript2";
import json from "@rollup/plugin-json";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

const packageFormats = process.env.FORMATS && process.env.FORMATS.split(",");
const sourcemap = process.env.SOURCE_MAP;
const target = process.env.TARGET;

// ^ 需要根据target 找到要打包的目录
const packagesDir = path.resolve(__dirname, "packages");
const packageDir = path.resolve(packagesDir, target);

const resolve = (p) => path.resolve(packageDir, p); // 以打包的目录解析文件
const name = path.basename(packageDir);

const pkg = require(resolve("package.json"));

console.log(name);

const outputConfig = {
  "esm-bundler": {
    file: resolve(`dist/${name}.js`),
    format: "es",
  },
  cjs: {
    file: resolve(`dist/${name}.cjs.js`),
    format: "cjs",
  },
  global: {
    file: resolve(`dist/${name}.global.js`),
    format: "iife",
  },
};

const packageConfigs = packageFormats || pkg.buildOptions.formats;

function createConfig(format, output) {
  //output.sourcemap = sourcemap; // 添加sourcemap
  // output.exports = "named";
  let external = [];
  if (format === "global") {
    output.name = pkg.buildOptions.name;
  } else {
    external = [...Object.keys(pkg.dependencies)];
  }
  return {
    input: resolve(`src/index.ts`),
    output,
    external,
    plugins: [json(), ts(), commonjs(), nodeResolve()],
  };
}

export default packageConfigs.map((format) =>
  createConfig(format, outputConfig[format])
);
