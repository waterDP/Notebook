/* eslint-disable promise/param-names */
import { commonStartEffect, releaseAllEffect, ports, setAppName } from '../common/initial'
import { appInstanceMap } from '../../create_app'
import microApp from '../..'

const customDocumentOnClick = () => { console.log('会影响 microApp 内置对 onclick 的处理') }

describe('sandbox custom proxy document property', () => {
  let appCon: Element
  beforeAll(() => {
    commonStartEffect(ports.custom_proxy_document)
    
    microApp.start({
      customProxyDocumentProps: new Map<string | number | symbol, () => void>([
        ['title', () => {}], // 忽略 document.title 执行
        ['onclick', customDocumentOnClick]
      ]),
    })
    appCon = document.querySelector('#app-container')!
  })

  afterAll(() => {
    return releaseAllEffect()
  })

  // 自定义代理 document.title 测试
  test('custom proxy document.title', async () => {
    const microAppElement1 = document.createElement('micro-app')
    microAppElement1.setAttribute('name', 'test-app1')
    microAppElement1.setAttribute('url', `http://127.0.0.1:${ports.custom_proxy_document}/common/`)

    appCon.appendChild(microAppElement1)

    await new Promise((resolve) => {
      microAppElement1.addEventListener('mounted', () => {
        setAppName('test-app1')
        // get current title
        const originTitle = document.title

        // change title
        document.title = 'new title'

        // change title not working
        expect(document.title).toBe(originTitle)
        resolve(true)
      })
    })
  })

  // document.onclick 测试
  test('custom proxy document.onclick will working', async () => {

    const microAppElement2 = document.createElement('micro-app')
    microAppElement2.setAttribute('name', 'test-app2')
    microAppElement2.setAttribute('url', `http://127.0.0.1:${ports.custom_proxy_document}/common/`)

    appCon.appendChild(microAppElement2)

    await new Promise((resolve) => {
      microAppElement2.addEventListener('mounted', () => {
        expect(appInstanceMap.size).toBe(1)
        // 基座应用document.onclick赋值/取值
        const baseDomOnclick = jest.fn()
        document.onclick = baseDomOnclick
        expect(document.onclick).toBe(customDocumentOnClick)

        resolve(true)
      }, false)
    })
  })

})
