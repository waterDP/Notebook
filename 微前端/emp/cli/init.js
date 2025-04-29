/*
 * @Author: water.li
 * @Date: 2025-04-19 22:59:13
 * @Description: 
 * @FilePath: \Notebook\微前端\emp\cli\init.js
 */

const axios = require('axios')
const { createrSpinner } = require('nanospinner')
const git = require('git-promise')
const fs = require('fs-extra')
const path = require('path')

class Init {
  templates = {}
  async setup(options) {
    if (typeof options.template === 'string') {
      const templates = await this.checkTemplate(options.template)
      if (templates) {
        this.templates = templates
      }
    }
    await this.selectTemplate(this.templates)
  }

  async checkTemplate(url) {
    const { data } = await axios.get(url)
    return data
  }

  async selectTemplate(templates) {
    const inquirer = (await import('inquirer')).default
    const anwsers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: '请输入项目名',
        default() {
          return 'emp-project'
        }
      },
      {
        type: 'list',
        name: 'template',
        message: '请选择模板',
        choices: Object.keys(templates)
      }
    ])
    const gitRepo = this.templates[anwsers.template]
    await this.downloadRepo(gitRepo, anwsers.name)
  }
  async downloadRepo(repoPath, localPath) {
    const spinner = createrSpinner()
    spinner.start({
      text: '正在下载模板\n'
    })
    await git(`clone ${repoPath} ./${localPath}`)
    spinner.success({
      text: `cd ${localPath} & npm install & npm run dev`
    })
  }
}

module.exports = new Init()