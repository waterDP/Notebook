/* eslint-disable promise/param-names */
import {
  commonStartEffect,
  releaseAllEffect,
  ports,
  jestConsoleError,
} from './common/initial'
import microApp from '..'

describe('micro_app', () => {
  let appCon: Element
  beforeAll(() => {
    commonStartEffect(ports.micro_app)
    appCon = document.querySelector('#app-container')!
  })

  afterAll(() => {
    return releaseAllEffect()
  })

  test('just define micro-app in pure start', () => {
    microApp.start({
      shadowDOM: false,
      destroy: false,
      inline: true,
      disableScopecss: false,
      disableSandbox: false,
    })

    expect(Boolean(window.customElements.get('micro-app'))).toBeTruthy()
  })

  // 测试microApp.renderApp方法
  test('test microApp.renderApp', async () => {
    await microApp.renderApp({
      name: 'test-app1',
      url: `http://127.0.0.1:${ports.micro_app}/common/`,
      container: appCon,
    }).then(() => {
      expect(microApp.getAllApps().includes('test-app1')).toBeTruthy()
    })
  })

  // 测试microApp.getActiveApps/getAllApps方法
  test('test microApp.getActiveApps/getAllApps', async () => {
    expect(microApp.getActiveApps().includes('test-app1')).toBeTruthy()
    expect(microApp.getAllApps().includes('test-app1')).toBeTruthy()
  })

  // 测试microApp.reload方法
  test('test microApp.reload', async () => {
    microApp.reload('test-app1').then(() => {
      expect(microApp.getActiveApps().includes('test-app1')).toBeTruthy()
    })
  })

  // 测试microApp.unmountApp/unmountAllApps方法
  test('test microApp.unmountApp/unmountAllApps', async () => {
    microApp.unmountApp('test-app1').then(() => {
      expect(microApp.getActiveApps().includes('test-app1')).toBeFalsy()
    })

    microApp.unmountAllApps().then(() => {
      expect(microApp.getActiveApps().includes('test-app1')).toBeFalsy()
    })
  })

  // 在不支持customElements的环境下打印错误信息
  test('log error message if customElements is not supported in this environment', () => {
    const rawCustomElements = window.customElements
    Object.defineProperty(window, 'customElements', {
      value: undefined,
      writable: true,
      configurable: true,
    })

    microApp.start()
    expect(jestConsoleError).toBeCalledWith('[micro-app] micro-app is not supported in this environment')

    window.customElements = rawCustomElements
  })

  // tagName非法
  test('log error message if config error tagName', () => {
    microApp.start({
      tagName: 'error-name',
    })

    expect(jestConsoleError).toBeCalledWith('[micro-app] microApp.start executed repeatedly')
  })

  // 格式化插件系统的appName
  test('format appName for plugins modules', () => {
    microApp.start({
      tagName: 'micro-app-plugins-modules',
      plugins: {
        modules: {
          '12$': [],
          'special-&name': [],
          'normal-name': []
        }
      }
    })
  })
})
