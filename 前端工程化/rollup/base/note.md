<!--
 * @Author: water.li
 * @Date: 2023-02-04 11:12:56
 * @Description:
 * @FilePath: \Notebook\前端工程化\rollup\note.md
-->

## vite3

- 开发的时候打包用的是 esbuild
- 上线的时候打包用的是 rollup
- vite 内部也是通过插件实现的，插件机制复用的 rollup 的插件机制

## 初始安装

pnpm i @babel/core @babel/preset-env @rollup/plugin-commonjs @rollup/plugin-node-resolve @rollup/plugin-typescript lodash rollup rollup-plugin-babel postcss rollup-plugin-postcss rollup-plugin-terser tslint typescript rollup-plugin-serve rollup-plugin-livereload -D
