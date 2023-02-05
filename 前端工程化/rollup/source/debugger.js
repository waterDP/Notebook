const path = require('path')
const rollup = require('./lib/rollup')

debugger

const entry = path.resolve(__dirname, 'src/main.js')
const output = path.resolve(__dirname, 'dist/bound.js')
rollup(entry, output)
