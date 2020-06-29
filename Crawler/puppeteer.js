const puppeteer = require('puppeteer');

(async function(){
  const browser = await puppeteer.launch() // 打开一无界面的浏览器
  const page = await browser.newPage() // 打开一个空白页面
  await page.goto('http://www.baidu.com') // 在地址栏中输入一个地址
  await page.screenshot({path: 'baidu.png'}) // 把当前的页面进行截图 保存到baidu.png5的页面里       
  await browser.close() // 关闭
})();

(async function() {
  const url = 'http://juejin.im/tag/前端'
  const browser = await puppeteer.launch({headless: false})
  const page = await browser.newPage()
  await page.goto(url, {waitUnit: 'networkidle2'})
  // 获取指定节点的属性
  const titles = await page.$$eval('a.title', elements => {
    return elements.map(element => element.innerText)
  })
  console.log(titles)
  browser.close()
})();