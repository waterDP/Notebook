#!/usr/bin/env node
const program = require('command')

program.version(require('../package.json').version)

program
  .command('init <name>')
  .description('init project')
  .action(require('../lib/init'))

program
  .command('refresh')
  .description('refresh router an menu')
  .action(require('../lib/refresh'))

program.parser(process.argv)