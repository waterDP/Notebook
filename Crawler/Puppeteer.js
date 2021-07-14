/**
 * ! Puppeteer
 * Puppeteer模块提供了一种启动Chromium实例的方法
 */
const puppeteer = require('puppeteer')

(async () => {
  const browser = await puppeteer.launch() 
  const page = await browser.newPage()
  await page.goto('https://www.google.com')
  // ...
  await browser.close()
})()

// todo methods
puppeteer.connect(options) 
// 此方法将Puppeteer连接到有的Chromium实例

puppeteer.createBrowserFetcher([options]) 
// options: host path platform product<chrome|firefox>

puppeteer.launch([options])


puppeteer.createBrowserFetcher([option])

// todo properties
puppeteer.product // <string>  返回处于自动化状态的浏览器名字(chrome或firefox)