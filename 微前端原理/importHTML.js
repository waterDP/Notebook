/*
 * @Author: water.li
 * @Date: 2022-02-25 21:52:01
 * @Description: 
 * @FilePath: \notebook\微前端原理\importHTML.js
 */
import fetchResource from "./fetchResource"

export const importHTML = async url => {
  const html = await fetchResource(url)
  const template = document.createElement('div')

  template.innerHTML = html

  const scripts = template.querySelectorAll('script')

  // 获取所有script标签的代码： [代码1，代码2]
  function getExternalScripts() {
    return Promise.all(Array.from(scripts).map(script => {
      const src = script.getAttribute('src')
      if (!src) {
        return Promise.resolve(script.innerHTML)
      } else {
        return fetchResource(src.startsWith('http') ? src : url+src)
      }
    }))
  }
  
  // 执行所有的scripts代码
  async function execScripts() {
    const scripts = await getExternalScripts()

    // 手动的构造一个Commonjs模块环境
    const module = {exports: {}}

    scripts.forEach(code => {
      eval(code)
    })

    return module.exports
  }

  return {
    template,
    getExternalScripts,
    execScripts
  }
}