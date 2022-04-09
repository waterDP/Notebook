/*
 * @Author: water.li
 * @Date: 2022-04-08 00:22:22
 * @Description: 
 * @FilePath: \notebook\Vue\vue-next\scripts\dev.js
 */
const minimist = require('minimist')
const execa = require("execa")

const args = minimist(process.argv.slice(2))

const target = args._.length ? args._[0] : 'runtime-dom'
const formats = args.f || 'global'
const sourcemap = args.s || false

console.log(formats)

execa('rollup', [
  '-wc', // --watch --config
  '--environment',
  [
    `TARGET:${target}`,
    `FORMATS:${formats}`,
    sourcemap ? `SOURCE_MAP:true` : ''
  ].filter(Boolean).join(',')
],{
  stdio: "inherit", // 这个子进程的输出是在我们当前命令行中输出的
})