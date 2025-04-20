#!/usr/bin/env node

const program = require('commander');
const pkg = require('../package.json')
const cli = require('../cli')

program.version(pkg.version, '-v, --version')
  .usage('<command> [options]')

program.command('init')
  .desciption('创建项目')
  .option('-t, --template [template]', 'JSON数据，HTTP的地址或者是文件的相对中路径或绝对路径')
  .action(options => {
    cli.exec('init', options)
  })

program.command('dev')
  .desciption('启动开发服务器')
  .option('-t, --template [template]', 'JSON数据，HTTP的地址或者是文件的相对中路径或绝对路径')
  .action(options => {
    cli.exec('dev', options)
  })
  
program.parse(process.argv);