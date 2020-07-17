const {promisify} = require('util')
const figlet = promisify(require('figlet'))
const clear = require('clear')
const chalk = require('chalk')
const open = require('open')

const log = content => console.log(chalk.green(content))
const {clone} = require('./download')

const spawn = (...args) => {
  const {spawn} = require('child_process')
  return new Promise(resolve => {
    const proc = spawn(...args)
    proc.stdout.pipe(process.stdout)
    proc.stderr.pipe(process.stderr)
    proc.on('close', resolve)
  })
}

module.exports = async name => {
  // 清屏
  clear()
  const data = await figlet('welcome')
  log(data)

  // clone
  log(`创建项目${name}`)
  await clone('github:su/...', name)
  // 自动安装依赖
  log('安装依赖')
  await spawn('cnpm', ['install'], {cwd: `./${name}`})
  log('安装完成')

  // 启动
  await spawn('npm', ['run', 'serve'], {cwd: `./${name}`})
  // 打开浏览器
  open('http://localhost:8080')
}