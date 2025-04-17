/* eslint-disable promise/param-names */
import { commonStartEffect, releaseAllEffect, ports, setAppName } from '../common/initial'
import microApp from '../..'

describe('source load_event', () => {
  let appCon: Element
  beforeAll(() => {
    commonStartEffect(ports.load_event)
    microApp.start()
    appCon = document.querySelector('#app-container')!
  })

  afterAll(() => {
    return releaseAllEffect()
  })

  // 支持使用两种方式监听error事件
  test('dispatchOnErrorEvent should support two ways', async () => {
    const microAppElement1 = document.createElement('micro-app')
    microAppElement1.setAttribute('name', 'test-app1')
    microAppElement1.setAttribute('url', `http://127.0.0.1:${ports.load_event}/dynamic/`)

    appCon.appendChild(microAppElement1)
    await new Promise((resolve) => {
      microAppElement1.addEventListener('mounted', () => {
        setAppName('test-app1')
        // 动态创建link
        const dynamicLink1 = document.createElement('link')
        dynamicLink1.setAttribute('rel', 'stylesheet')
        dynamicLink1.setAttribute('href', 'http://www.micro-app-test.com/not-exist.css')
        document.head.appendChild(dynamicLink1)
        // onerror 监听
        dynamicLink1.onerror = function () {
          expect(console.error).toBeCalledWith('[micro-app] app test-app1:', expect.any(Error))
        }

        // event 监听
        const dynamicLink2 = document.createElement('link')
        dynamicLink2.setAttribute('rel', 'stylesheet')
        dynamicLink2.setAttribute('href', 'http://www.micro-app-test.com/not-exist.css')
        document.head.appendChild(dynamicLink2)
        dynamicLink2.addEventListener('error', (event) => {
          expect(event.currentTarget).toBe(dynamicLink2)
          expect(event.srcElement).toBe(dynamicLink2)
          expect(event.target).toBe(dynamicLink2)
        })
        resolve(true)
      }, false)
    })
  })

  // 支持使用两种方式监听load事件
  test('dispatchOnLoadEvent should support two ways', async () => {
    const microAppElement2 = document.createElement('micro-app')
    microAppElement2.setAttribute('name', 'test-app2')
    microAppElement2.setAttribute('url', `http://127.0.0.1:${ports.load_event}/dynamic/`)

    appCon.appendChild(microAppElement2)
    await new Promise((resolve) => {
      microAppElement2.addEventListener('mounted', () => {
        setAppName('test-app2')
        // 动态创建link
        const dynamicLink1 = document.createElement('link')
        dynamicLink1.setAttribute('rel', 'stylesheet')
        dynamicLink1.setAttribute('href', './link1.css')
        document.head.appendChild(dynamicLink1)
        // onload 监听
        dynamicLink1.onload = jest.fn()

        // event 监听
        const dynamicLink2 = document.createElement('link')
        dynamicLink2.setAttribute('rel', 'stylesheet')
        dynamicLink2.setAttribute('href', './link1.css')
        document.head.appendChild(dynamicLink2)
        dynamicLink2.addEventListener('load', (event) => {
          expect(event.currentTarget).toBe(dynamicLink2)
          expect(event.srcElement).toBe(dynamicLink2)
          expect(event.target).toBe(dynamicLink2)
        })
        resolve(true)
      }, false)
    })
  })
})
