/*
 * @Author: water.li
 * @Date: 2023-02-04 11:18:13
 * @Description: 
 * @FilePath: \Notebook\前端工程化\rollup\rollup.config.js
 */
import babel from "@rollup/plugin-babel"
import nodeResolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
// import typescript from "@rollup/plugin-typescript"
import { terser } from "rollup-plugin-terser"
import serve from "rollup-plugin-serve"

export default {
  input: 'src/main.js',
  output: {
    file: 'dist/bundle.cjs.js', // 输出的文件路径和文件名
    format: 'iife', // 五种输出的格式 amd/es/iife/umd/cjs
    name: 'bundleName', // 当format的格式为iife和umd的时候必须提供变量名
    globals: {
      lodash: '_',
      jquery: '$'
    }
  },
  external: ['lodash', 'jquery'],
  plugins: [
    babel({
      exclude: /node_modules/
    }),
    nodeResolve(), // 作用是可以加载node_modules里有的模块
    commonjs(), // 可以支持commonjs语法
   // typescript(), // 支持ts
    terser(), // 压缩js
    serve({
      open: true,
      port: 8080,
      contentBase: './dist'
    })
  ]
}