/* eslint-disable promise/param-names */
import { commonStartEffect, releaseAllEffect, ports } from './common/initial'
import microApp from '..'
import preFetch from '../prefetch'
import { globalLinks } from '../source/links'
import { globalScripts } from '../source/scripts'

describe('prefetch', () => {
  // let appCon: Element
  beforeAll(() => {
    commonStartEffect(ports.prefetch)
    // appCon = document.querySelector('#app-container')!

    microApp.start({
      globalAssets: {
        js: [
          `http://127.0.0.1:${ports.prefetch}/common/script1.js`,
          `http://127.0.0.1:${ports.prefetch}/common/script1.js`,
          'http://not-exist.com/xxx.js'
        ],
        css: [
          `http://127.0.0.1:${ports.prefetch}/common/link1.css`,
          `http://127.0.0.1:${ports.prefetch}/common/link1.css`,
          'http://not-exist.com/xxx.css'
        ],
      }
    })
  })

  afterAll(() => {
    return releaseAllEffect()
  })

  // special case
  test('coverage branch for prefetch', async () => {
    preFetch(123 as any) // 非法的入参
    preFetch([{ name: 'test-app1', url: 'http://www.micro-app-test.com' }]) // 正常入参
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true)
      }, 100)
    })
  })

  // globalAssets 正确执行
  test('globalAssets should work normal', async () => {
    expect(globalLinks.get(`http://127.0.0.1:${ports.prefetch}/common/link1.css`)).not.toBeNull()
    expect(globalScripts.get(`http://127.0.0.1:${ports.prefetch}/common/script1.js`)).not.toBeNull()
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true)
      }, 100)
    })
  })

  // globalAssets 分支覆盖
  test('coverage branch of globalAssets', () => {
    microApp.start({
      tagName: 'micro-app-global-assets',
      globalAssets: {}
    })
  })

  // 分支覆盖: 错误的预加载入参
  test('coverage branch: Invalid prefetch params', () => {
    preFetch(['aa' as any])
  })
})
