/* eslint-disable promise/param-names */
import { commonStartEffect, releaseAllEffect, ports } from '../common/initial'
import { appInstanceMap } from '../../create_app'
import microApp from '../..'

describe('sandbox effect2', () => {
  let appCon: Element
  beforeAll(() => {
    commonStartEffect(ports.effect2)
    appCon = document.querySelector('#app-container')!

    microApp.start()
  })

  afterAll(() => {
    return releaseAllEffect()
  })

  // document.onclick 测试
  test('onclick can only be rewritten once', async () => {
    Object.defineProperty(document, 'onclick', {
      configurable: false,
      enumerable: true,
      value: null,
    })

    const microAppElement1 = document.createElement('micro-app')
    microAppElement1.setAttribute('name', 'test-app1')
    microAppElement1.setAttribute('url', `http://127.0.0.1:${ports.effect2}/common/`)

    appCon.appendChild(microAppElement1)

    await new Promise((resolve) => {
      microAppElement1.addEventListener('mounted', () => {
        expect(appInstanceMap.size).toBe(1)
        resolve(true)
      }, false)
    })
  })
})
