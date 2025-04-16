
const { Command } = require('commander')
const chalk = require('chalk')
const packageJSON = require('./package.json')
const fs = require('fs-extra')
const path = require('path')
const { spawn } = require('cross-spawn')

async function init() {
  let projectName
  // 初始化命令
  new Command(packageJSON.name)
    .version(packageJSON.version)
    .arguments('<project-directory>') // 项目目录名
    .usage(`${chalk.green('<project-directory>')}`) // 提示信息
    .action(name => {
      projectName = name // 项目目录名
    })
  await createApp(projectName)
}

async function createApp(appName) {
  let root = path.resolve(appName)
  fs.ensureDirSync(root) // 确保目录存在，不存在则创建
  console.log(`Create a new React app in ${chalk.green(root)}.`)
  const packageJSON = {
    name: appName,
    version: '1.0.0',
    private: true
  }
  fs.writeFileSync(
    path.join(root, 'package.json'),
    JSON.stringify(packageJSON, null, 2)
  )

  const originalDirectory = process.cwd() // 原始目录
  process.chdir(root) // 切换到项目目录

  await run(root, appName, originalDirectory)
}

/**
 * @description: 运行
 * @param {*} root 项目目录
 * @param {*} appName 项目名称
 * @param {*} originalDirectory 原始目录`
 */
async function run(root, appName, originalDirectory) {
  let scriptName = 'react-scripts'
  let templateName = 'cra-template'
  const allDependencies = ['react', 'react-dom', scriptName, templateName]
  console.log(`Installing packages. This might take a couple of minutes.`)
  console.log(`Installing ${chalk.cyan('react')}, ${chalk.cyan('react-dom')}, ${chalk.cyan(scriptName)}, ${chalk.cyan(templateName)}`)
  await install(root, allDependencies)

  let data = [root, appName, true, originalDirectory, templateName]
  let source = `
    var init = require('react-scripts/scripts/init.js');
    init.apply(null, JSON.parse(process.argv[1]));
    init(...JSON.parse(process.argv[1]));
  `
  await executeNodeScript({ cwd: process.cwd() }, data, source)
  console.log('Done.')
  process.exit(0)
}

async function executeNodeScript({ cwd }, data, source) {
  return new Promise(resolve => {
    const child = spawn(
      process.execPath, // node 可执行文件路径
      ['-e', source, '--', JSON.stringify(data)],
      { cwd, stdio: 'inherit' }
    )
    child.on('close', resolve)
  })
}

async function install(root, dependencies) {
  return new Promise(resolve => {
    const command = 'yarnpkg'
    const args = ['add', '--exact', ...dependencies, '--cwd', root]
    console.log(command, args)
    const child = spawn(command, args, { stdio: 'inherit' }) // 子进程
    child.on('close', resolve) // 子进程关闭时，resolve
  })
}

module.exports = {
  init
}