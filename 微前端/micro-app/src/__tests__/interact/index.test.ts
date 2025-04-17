/* eslint-disable promise/param-names */
import {
  rewriteConsole,
  releaseConsole,
  jestConsoleError,
} from '../common/initial'
import microApp from '../..'
import {
  EventCenterForBaseApp,
  EventCenterForMicroApp,
  recordDataCenterSnapshot,
  rebuildDataCenterSnapshot,
} from '../../interact'
import {
  defer,
} from '../../libs/utils'
import CreateApp, { appInstanceMap } from '../../create_app'

describe('data center', () => {
  const app1EventHandler = jest.fn()
  const app2EventHandler = jest.fn()
  beforeAll(() => {
    rewriteConsole()
    microApp.start()
    const con1 = document.createElement('micro-app')
    con1.attachShadow({ mode: 'open' })
    con1.addEventListener('datachange', app1EventHandler, false)
    const app1 = {
      name: 'test-app1',
      url: 'http://localhost:3000/',
      scopecss: true,
      useSandbox: true,
      container: con1.shadowRoot,
    }
    appInstanceMap.set('test-app1', app1 as CreateApp)

    const con2 = document.createElement('micro-app')
    con2.addEventListener('datachange', app2EventHandler, false)
    const app2 = {
      name: 'test-app2',
      url: 'http://localhost:3000/',
      scopecss: true,
      useSandbox: true,
      container: con2,
    }
    appInstanceMap.set('test-app2', app2 as CreateApp)
  })

  afterAll(() => {
    releaseConsole()
  })

  const nextFrame = async () => await new Promise((resolve) => {
    defer(() => {
      resolve(true)
    })
  })
  const baseApp = new EventCenterForBaseApp()
  const microApp1 = new EventCenterForMicroApp('test-app1')
  const microApp2 = new EventCenterForMicroApp('test-app2')

  // umd app 分支代码覆盖
  test('coverage branch of pure umd app', () => {
    recordDataCenterSnapshot(microApp1)
  })

  test('main process of data center', async () => {
    // 基座监听子应用app1的数据
    const cbForApp1 = jest.fn()
    const cbForApp2 = jest.fn()
    const cbForApp2AutoTrigger = jest.fn()
    const cbForGlobal = jest.fn()

    // 子应用app1绑定的监听函数
    const app1Cb = jest.fn()
    const app1CbOther = jest.fn()
    const app1Global = jest.fn()

    // 子应用2绑定的监听函数
    const app2Cb = jest.fn()
    const app2CbAutoTrigger = jest.fn()
    const app2GlobalCb = jest.fn()
    const app2GlobalCbAutoTrigger = jest.fn()

    // 数据对象
    const dataToApp1Case1 = { info: 'data to app1 from baseApp' }
    const dataToApp1Case2 = { info: 'data to app1 from baseApp' }
    const dataFromApp1 = { info: 'data from app1' }
    const dataToApp2Case1 = { info: 'data to app2 from baseApp' }
    const dataToApp2Case2 = { info: 'data to app2 from baseApp 2' }
    const dataFromApp2Case1 = { info: 'data from app2' }
    const dataFromApp2Case2 = { info: 'data from app2 2' }
    const dataFromApp2Case3 = { info: 'data from app2 3' }
    const globalData1 = { info: 'global data1' }
    const globalData2 = { info: 'global data2' }
    const globalData3 = { info: 'global data3' }
    const globalData4 = { info: 'global data4' }

    // dispatch是异步执行的，所以等待下一帧后执行后续操作
    microApp2.dispatch(dataFromApp2Case1)
    await nextFrame()

    baseApp.setData('test-app2', dataToApp2Case1)
    baseApp.setGlobalData(globalData1)

    // 基座应用绑定监听
    baseApp.addDataListener('test-app1', cbForApp1)
    baseApp.addDataListener('test-app2', cbForApp2)
    baseApp.addDataListener('test-app2', cbForApp2AutoTrigger, true)
    baseApp.addGlobalDataListener(cbForGlobal)

    // app1绑定监听
    microApp1.addDataListener(app1Cb)
    microApp1.addDataListener(app1CbOther)
    microApp1.addGlobalDataListener(app1Global)

    // app2绑定监听
    microApp2.addDataListener(app2Cb)
    microApp2.addDataListener(app2CbAutoTrigger)
    microApp2.addGlobalDataListener(app2GlobalCb)
    microApp2.addGlobalDataListener(app2GlobalCbAutoTrigger)

    // 等待自动触发
    await nextFrame()

    // 自动触发
    expect(cbForApp2).not.toBeCalled()
    expect(cbForApp2AutoTrigger).toBeCalledWith(dataFromApp2Case1)
    expect(app2EventHandler).toBeCalled()

    // expect(app2Cb).not.toBeCalled()
    expect(app2CbAutoTrigger).toBeCalledWith(dataToApp2Case1)
    // expect(app2GlobalCb).not.toBeCalled()
    expect(app2GlobalCbAutoTrigger).toBeCalledWith(globalData1)

    // 基座向子应用app1发送数据
    baseApp.setData('test-app1', dataToApp1Case1)
    baseApp.setData('test-app1', dataToApp1Case1)
    baseApp.setData('test-app1', '11' as any)
    // 等待事件触发
    await nextFrame()
    expect(app1Cb).toBeCalledWith(dataToApp1Case1)
    expect(app1CbOther).toBeCalledWith(dataToApp1Case1)
    expect(app1Cb).toBeCalledTimes(1)
    // 空对象
    expect(JSON.stringify(baseApp.getData('test-app1'))).toBe('{}')
    expect(baseApp.getData('test-app1', true)).toStrictEqual(dataToApp1Case1)

    // app2向基座发送数据
    // 相同数据，或非对象数据不会触发回调
    microApp1.dispatch(dataFromApp1)
    microApp1.dispatch(dataFromApp1)
    microApp1.dispatch('11' as any)
    await nextFrame()
    expect(jestConsoleError).toBeCalledWith('[micro-app] event-center: data must be object')
    expect(cbForApp1).toBeCalledTimes(1)
    expect(cbForApp1).toBeCalledWith(dataFromApp1)
    expect(app1EventHandler).toBeCalled()

    // 基座向app2发送数据
    baseApp.setData('test-app2', dataToApp2Case2)
    await nextFrame()
    expect(app2Cb).toBeCalledWith(dataToApp2Case2)
    expect(app2CbAutoTrigger).toBeCalledWith(dataToApp2Case2)

    // 全局事件
    microApp1.setGlobalData(globalData2)
    await nextFrame()
    expect(cbForGlobal).toBeCalledWith(globalData2)
    expect(app1Global).toBeCalledWith(globalData2)
    expect(app2GlobalCb).toBeCalledWith(globalData2)
    expect(app2GlobalCbAutoTrigger).toBeCalledWith(globalData2)
    // 通过getGlobalData直接获取数据
    expect(microApp1.getGlobalData()).toStrictEqual(globalData2)

    // 基座应用卸载单个test-app2的监听
    baseApp.removeDataListener('test-app2', cbForApp2)
    microApp2.dispatch(dataFromApp2Case2)
    await nextFrame()
    expect(cbForApp2).not.toBeCalled()
    expect(cbForApp2AutoTrigger).toBeCalledWith(dataFromApp2Case2)
    expect(app2EventHandler).toBeCalled()

    cbForApp2.mockClear()
    cbForApp2AutoTrigger.mockClear()
    // 基座应用卸载所有test-app2的监听
    baseApp.clearDataListener('test-app2')
    microApp2.dispatch(dataFromApp2Case3)
    await nextFrame()
    expect(cbForApp2).not.toBeCalled()
    expect(cbForApp2AutoTrigger).not.toBeCalled()
    // 监听卸载，缓存数据不删除
    expect(baseApp.getData('test-app2')).toStrictEqual(dataFromApp2Case3)
    expect(app2EventHandler).toBeCalled()

    app1Cb.mockClear()
    // app1卸载单个监听
    microApp1.removeDataListener(app1Cb)
    baseApp.setData('test-app1', dataToApp1Case2)
    expect(app1Cb).not.toBeCalled()
    expect(app1CbOther).toBeCalledWith(dataToApp1Case2)

    app1Cb.mockClear()
    app1CbOther.mockClear()
    // app1卸载所有监听
    microApp1.clearDataListener()
    expect(app1Cb).not.toBeCalled()
    expect(app1CbOther).not.toBeCalled()
    // 即便卸载所有监听，但数据缓存不清除
    expect(microApp1.getData()).toStrictEqual(dataToApp1Case2)

    // 删除单个全局监听
    app1Global.mockClear()
    microApp1.removeGlobalDataListener(app1Global)
    baseApp.setGlobalData(globalData3)
    await nextFrame()
    expect(cbForGlobal).toBeCalledWith(globalData3)
    expect(app1Global).not.toBeCalled()
    expect(app2GlobalCb).toBeCalledWith(globalData3)
    expect(app2GlobalCbAutoTrigger).toBeCalledWith(globalData3)

    // 每个应用只能清空自身的全局数据监听
    cbForGlobal.mockClear()
    app1Global.mockClear()
    app2GlobalCb.mockClear()
    app2GlobalCbAutoTrigger.mockClear()
    microApp2.clearGlobalDataListener()
    baseApp.setGlobalData(globalData4)
    await nextFrame()
    // 基座应用全局数据函数没有被清空
    expect(cbForGlobal).toBeCalledWith(globalData4)
    // 上一步已经解绑
    expect(app1Global).not.toBeCalled()
    expect(app2GlobalCb).not.toBeCalled()
    expect(app2GlobalCbAutoTrigger).not.toBeCalled()

    cbForGlobal.mockClear()
    app1Global.mockClear()
    app2GlobalCb.mockClear()
    // microApp2重新绑定全局数据监听
    microApp2.addGlobalDataListener(app2GlobalCb)
    // 清空基座应用全局数据绑定
    baseApp.clearGlobalDataListener()
    baseApp.setGlobalData(globalData3)
    await nextFrame()
    // 基座全局绑定不再执行
    expect(cbForGlobal).not.toBeCalled()
    // microApp2全局数据函数正常执行
    expect(app2GlobalCb).toBeCalledWith(globalData3)
  })

  // 一些异常情况
  test('unusual circumstance', async () => {
    // 不存在的数据
    baseApp.removeDataListener('not-exit', () => {})
    expect(baseApp.getData('not-exist')).toBe(null)

    // 非正常name
    baseApp.setData('', {})
    baseApp.setData(123 as any, {})
    baseApp.removeDataListener({} as any, () => {})
    baseApp.addDataListener((() => {}) as any, () => {})
    expect(jestConsoleError).toBeCalledTimes(4)
    expect(jestConsoleError).toBeCalledWith('[micro-app] event-center: Invalid name')

    // 非正常函数
    baseApp.addDataListener('test-app1', null as any)
    baseApp.removeDataListener('test-app1', null as any)
    microApp1.removeGlobalDataListener(null as any)
    microApp1.removeDataListener('abc' as any)
    expect(jestConsoleError).toBeCalledWith('[micro-app] event-center: Invalid callback function')

    appInstanceMap.get('test-app2')!.container = null
    microApp2.dispatch({ info: '容器被清空后发送数据' })
    await nextFrame()
    expect(app2EventHandler).not.toBeCalled()
    appInstanceMap.delete('test-app2')
    microApp2.dispatch({ info: '应用被卸载后发送数据' })
  })

  // umd app 数据绑定函数快照代码分支覆盖
  test('coverage of umd app', () => {
    recordDataCenterSnapshot(microApp1)
    rebuildDataCenterSnapshot(microApp1)
    const microApp3 = new EventCenterForMicroApp('test-app3')
    recordDataCenterSnapshot(microApp3)
  })

  // 测试带有特殊符号的 appName
  test('test special appName', () => {
    // 初始化子应用数据对象 - 带有特殊符号，被格式化的appName
    const specialNameApp1 = new EventCenterForMicroApp('special-name_$#1')
    expect(specialNameApp1.appName).toBe('special-name_1')

    // 初始化子应用数据对象 - 错误的appName
    new EventCenterForMicroApp('&') // eslint-disable-line
    expect(jestConsoleError).toHaveBeenCalledWith('[micro-app] Invalid appName &')

    // 基座应用发送数据 - 错误的appName
    baseApp.setData('^', {})
    expect(jestConsoleError).toHaveBeenCalledWith('[micro-app] event-center: Invalid name')
  })
})
