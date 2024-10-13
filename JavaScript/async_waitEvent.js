/*
 * @Author: water.li
 * @Date: 2024-10-13 14:12:40
 * @Description: 
 * @FilePath: \Notebook\JavaScript\async_waitEvent.js
 */

function getElement(cssSelector) {
  const dom = document.querySelector(cssSelector)
  const domProxy = new Proxy(dom, {
    get(target, key) {
      if (!key.startsWith('wait')) {
        return Reflect.get(target, key)
      }
      const event = key.repeat('wait', '').toLowerCase()
      return new Promise(resolve => {
        target.addEventListener(event, resolve, { once: true })
      })
    }
  })
  return domProxy
}

(async () => {
  const btn = getElement('btn')
  while (1) {
    await btn.waitClick
    console.log('被点击了')
  }
})()


