/* eslint-disable promise/param-names */
import { commonStartEffect, releaseAllEffect, ports } from '../common/initial'
import { appInstanceMap } from '../../create_app'
import microApp from '../..'

declare global {
  interface HTMLElement {
    src: string
    href: string
  }
}

describe('source index', () => {
  let appCon: Element
  beforeAll(() => {
    commonStartEffect(ports.source_index)
    microApp.start({
      // globalAssets 测试分支覆盖
      globalAssets: {
        js: 'xx' as any,
        css: 'xx' as any,
      },
      plugins: {
        global: [
          {
            excludeChecker: (url) => ['link3.css', 'script3.js'].some(item => url.endsWith(item)),
            processHtml (code, _url, _options) {
              return code
            }
          },
          {
            processHtml: 'invalid processHtml' as any,
          }
        ],
        modules: {
          'test-app2': [
            {
              excludeChecker: (url) => ['link4.css', 'script4.js'].some(item => url.endsWith(item))
            }
          ],
          'test-app3': [
            {
              processHtml: 'invalid loader' as any,
            }
          ],
          'test-app4': 'invalid plugin' as any,
          'test-app8': [
            {
              processHtml (code, _url, _options) {
                return code.replace('app', 'app-replaced')
              }
            }
          ],
        }
      }
    })
    appCon = document.querySelector('#app-container')!
  })

  afterAll(() => {
    return releaseAllEffect()
  })

  // 带有exclude属性的dom需要被忽略
  test('exclude dom should be ignore', async () => {
    const microAppElement2 = document.createElement('micro-app')
    microAppElement2.setAttribute('name', 'test-app2')
    microAppElement2.setAttribute('url', `http://127.0.0.1:${ports.source_index}/element-config/`)
    microAppElement2.setAttribute('disableScopecss', 'true')

    await new Promise((resolve) => {
      microAppElement2.addEventListener('mounted', () => {
        expect(document.getElementById('app4-style-exclude')).toBeNull()
        expect(document.getElementById('app4-link-exclude')).toBeNull()
        expect(document.getElementById('app4-script-exclude')).toBeNull()
        expect(document.getElementById('app4-link-include')).toBeNull()
        expect(document.getElementById('app4-global-plugin-link-exclude')).toBeNull()
        expect(document.getElementById('app4-module-plugin-link-exclude')).toBeNull()
        expect(document.getElementById('app4-global-plugin-script-exclude')).toBeNull()
        expect(document.getElementById('app4-module-plugin-script-exclude')).toBeNull()

        const app = appInstanceMap.get('test-app2')!
        expect(app.source.links.size).toBe(3)
        expect(app.source.scripts.size).toBe(3)
        resolve(true)
      }, false)

      appCon.appendChild(microAppElement2)
    })
  })

  // 支持text类型入口文件
  test('support text file as index', async () => {
    const microAppElement3 = document.createElement('micro-app')
    microAppElement3.setAttribute('name', 'test-app3')
    microAppElement3.setAttribute('url', `http://127.0.0.1:${ports.source_index}/element-config/index.txt`)
    await new Promise((resolve) => {
      microAppElement3.addEventListener('mounted', () => {
        const app = appInstanceMap.get('test-app3')!
        expect(app.source.links.size).toBe(1)
        expect(app.source.scripts.size).toBe(0)
        resolve(true)
      }, false)

      appCon.appendChild(microAppElement3)
    })
  })

  // html 没有head或body标签则报错
  test('no head or no body element in html', async () => {
    const microAppElement4 = document.createElement('micro-app')
    microAppElement4.setAttribute('name', 'test-app4')
    microAppElement4.setAttribute('url', `http://127.0.0.1:${ports.source_index}/special-html/nohead.html`)

    appCon.appendChild(microAppElement4)
    const noHeadErrorHandle = jest.fn()
    microAppElement4.addEventListener('error', noHeadErrorHandle)

    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true)
      }, 200)
    })

    expect(console.error).toBeCalledWith('[micro-app] app test-app4: element head is missing')
    expect(noHeadErrorHandle).toBeCalledWith(expect.any(CustomEvent))

    const microAppElement5 = document.createElement('micro-app')
    microAppElement5.setAttribute('name', 'test-app5')
    microAppElement5.setAttribute('url', `http://127.0.0.1:${ports.source_index}/special-html/nobody.html`)

    appCon.appendChild(microAppElement5)
    const nobodyErrorHandle = jest.fn()
    microAppElement5.addEventListener('error', nobodyErrorHandle)

    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true)
      }, 200)
    })

    expect(console.error).toHaveBeenLastCalledWith('[micro-app] app test-app5: element body is missing')
    expect(nobodyErrorHandle).toBeCalledWith(expect.any(CustomEvent))
  })

  // 补全html中的img, 但iframe、a不做处理
  test('completion path of img/iframe/a in html', async () => {
    const microAppElement6 = document.createElement('micro-app')
    microAppElement6.setAttribute('name', 'test-app6')
    microAppElement6.setAttribute('url', `http://127.0.0.1:${ports.source_index}/ssr-render/`)

    appCon.appendChild(microAppElement6)

    await new Promise((resolve) => {
      microAppElement6.addEventListener('mounted', () => {
        expect(document.getElementById('app2-img1')?.getAttribute('src')).toBe(`http://127.0.0.1:${ports.source_index}/path-a/img.jpg`)
        expect(document.getElementById('app2-iframe1')?.getAttribute('src')).toBe('/path-b/')
        expect(document.getElementById('app2-a1')?.getAttribute('href')).toBe('/abc/')
        resolve(true)
      }, false)
    })
  })

  // 返回一个空的html
  test('test empty html', async () => {
    const microAppElement7 = document.createElement('micro-app')
    microAppElement7.setAttribute('name', 'test-app7')
    microAppElement7.setAttribute('url', `http://127.0.0.1:${ports.source_index}/special-html/empty.html`)

    appCon.appendChild(microAppElement7)

    await new Promise((resolve) => {
      setTimeout(() => {
        expect(console.error).toHaveBeenLastCalledWith('[micro-app] app test-app7: html is empty, please check in detail')
        resolve(true)
      }, 100)
    })
  })

  // 会执行 processHtml 函数
  test('executor processHtml plugin', async () => {
    const microAppElement8 = document.createElement('micro-app')
    microAppElement8.setAttribute('name', 'test-app8')
    microAppElement8.setAttribute('url', `http://127.0.0.1:${ports.source_index}/special-html/process-html.html`)

    appCon.appendChild(microAppElement8)
    await new Promise((resolve) => {
      microAppElement8.addEventListener('mounted', () => {
        expect(document.getElementById('app-replaced')).toBeTruthy()
        resolve(true)
      }, false)

      appCon.appendChild(microAppElement8)
    })
  })
})
