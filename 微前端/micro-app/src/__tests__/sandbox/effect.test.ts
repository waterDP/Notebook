/* eslint-disable promise/param-names */
import { commonStartEffect, releaseAllEffect, ports, setAppName } from '../common/initial'
import { appInstanceMap } from '../../create_app'
import microApp from '../..'

describe('sandbox effect', () => {
  let appCon: Element
  beforeAll(() => {
    commonStartEffect(ports.effect)
    appCon = document.querySelector('#app-container')!

    microApp.start({
      plugins: {}, // sandbox/index 分支覆盖
    })
  })

  afterAll(() => {
    return releaseAllEffect()
  })

  // 测试document click一些特殊分支
  test('special branch coverage of document click', async () => {
    const microAppElement1 = document.createElement('micro-app')
    microAppElement1.setAttribute('name', 'test-app1')
    microAppElement1.setAttribute('url', `http://127.0.0.1:${ports.effect}/common/`)

    document.onclick = null

    appCon.appendChild(microAppElement1)

    await new Promise((resolve) => {
      microAppElement1.addEventListener('mounted', () => {
        expect(appInstanceMap.size).toBe(1)
        // 基座应用document.onclick赋值/取值
        const baseDomOnclick = jest.fn()
        document.onclick = baseDomOnclick
        expect(document.onclick).toBe(baseDomOnclick)

        // 基座应用 document 通过addEventListener监听/卸载
        document.addEventListener('click', baseDomOnclick, false)
        document.removeEventListener('click', baseDomOnclick, false)
        resolve(true)
      }, false)
    })
  })

  // 测试window event一些特殊分支
  test('special branch coverage of window event', async () => {
    const microAppElement2 = document.createElement('micro-app')
    microAppElement2.setAttribute('name', 'test-app2')
    microAppElement2.setAttribute('url', `http://127.0.0.1:${ports.effect}/ssr-render/`)

    appCon.appendChild(microAppElement2)

    await new Promise((resolve) => {
      microAppElement2.addEventListener('mounted', () => {
        expect(appInstanceMap.size).toBe(2)
        resolve(true)
      }, false)
    })
  })

  // effect snapshot 分支覆盖
  test('coverage branch of umd effect snapshot', async () => {
    const microAppElement3 = document.createElement('micro-app')
    microAppElement3.setAttribute('name', 'test-app3')
    microAppElement3.setAttribute('library', 'umd-app2') // 自定义umd名称
    microAppElement3.setAttribute('url', `http://127.0.0.1:${ports.effect}/umd2`)

    let commonResolve: CallableFunction
    function firstMountHandler () {
      microAppElement3.removeEventListener('mounted', firstMountHandler)
      appCon.removeChild(microAppElement3)
      commonResolve(true)
    }

    microAppElement3.addEventListener('mounted', firstMountHandler)

    await new Promise((resolve) => {
      commonResolve = resolve
      appCon.appendChild(microAppElement3)
    })

    await new Promise((resolve) => {
      microAppElement3.addEventListener('mounted', () => {
        resolve(true)
      })
      // 再次渲染
      appCon.appendChild(microAppElement3)
    })
  })

  // 分支覆盖 -- umd模式下 document事件的 bound 函数
  test('coverage of bound function of document event in umd mode', async () => {
    const microAppElement4 = document.createElement('micro-app')
    microAppElement4.setAttribute('name', 'test-app4')
    microAppElement4.setAttribute('url', `http://127.0.0.1:${ports.effect}/umd1/`)

    appCon.appendChild(microAppElement4)

    await new Promise((resolve) => {
      microAppElement4.addEventListener('mounted', () => {
        setAppName('test-app4')
        const boundFunc1 = function func1 () {}
        const boundFunc2 = function func2 () {}
        const boundFunc3 = function func3 () {}

        const app = appInstanceMap.get('test-app4')!

        // scene1 - app not exist
        appInstanceMap.delete('test-app4')
        document.addEventListener('click', boundFunc1, false)
        document.removeEventListener('click', boundFunc1, false)

        // scene2 - app not umd mode
        app.umdMode = false
        appInstanceMap.set('test-app4', app)
        document.addEventListener('click', boundFunc2, false)
        document.removeEventListener('click', boundFunc2, false)

        // scene3 - app is umd mode, and listener is bound function
        app.umdMode = true
        document.addEventListener('click', boundFunc3, false)
        document.removeEventListener('click', boundFunc3, false)

        resolve(true)
      }, false)
    })
  })

  // 分支覆盖 -- iframe 沙箱下 html 内容中已存在元素的 instanceof 判定
  test('coverage of instanceof judgement of element in html content under iframe sandbox', async () => {
    const microAppElement5 = document.createElement('micro-app')
    microAppElement5.setAttribute('name', 'test-app5')
    microAppElement5.setAttribute('iframe', 'true');
    microAppElement5.setAttribute('url', `http://127.0.0.1:${ports.effect}/umd4/`)

    appCon.appendChild(microAppElement5)

    await new Promise((resolve) => {
      microAppElement5.addEventListener('mounted', () => {
        setAppName('test-app5')
        const app = appInstanceMap.get('test-app5')!

        const proxyWindow = app.sandBox.proxyWindow;

        expect(app.querySelector('#umd-root4') instanceof proxyWindow.Element).toBe(true)
        expect(app.querySelector('.container') instanceof proxyWindow.Element).toBe(true)

        resolve(true)
      }, false)
    })
  })
})
