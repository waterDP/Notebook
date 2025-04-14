/*
 * @Author: water.li
 * @Date: 2025-04-13 09:42:09
 * @Description:
 * @FilePath: \Notebook\前端工程化\Rollup\rollup.config.js
 */
import json from "@rollup/plugin-json"
// npm install --save-dev @rollup/plugin-node-resolve
import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import { terser } from "rollup-plugin-terser"
import alias from '@rollup/plugin-alias'
export default {
  input: 'index.js', // 入口文件
  plugins: [ // 插件
    json(), // 解析json文件
    commonjs(), // 将commonjs模块转换为es模块
    resolve(), // 解析第三方模块
    alias ({
      entries: {
        a: './a'
      }
    })
  ],
  external: ['react'], // 排除模块
  output: {
    file: 'bundle.js', // 输出文件
    format: 'esm', // 输出模块格式
    name: 'index', // 导出的模块名
    plugins: [terser()],
    banner: `/** this is banner */`
  }
}