/* eslint-disable promise/param-names */
import {
  commonStartEffect,
  releaseAllEffect,
  ports,
  jestConsoleError,
} from './common/initial'
import CreateApp, { appInstanceMap } from '../create_app'
import microApp from '..'
import { defer } from '../libs/utils'

describe('micro_app_element', () => {
  let appCon: Element
  beforeAll(() => {
    commonStartEffect(ports.micro_app_element)
    appCon = document.querySelector('#app-container')!
    window.keepAliveListener = jest.fn()

    microApp.start({
      preFetchApps: [
        {
          name: 'test-app1',
          url: `http://127.0.0.1:${ports.micro_app_element}/common`,
        },
        {
          name: 'test-app12',
          url: `http://127.0.0.1:${ports.micro_app_element}/common`,
        },
      ]
    })
  })

  afterAll(() => {
    return releaseAllEffect()
  })

  // 正常渲染
  test('render app2 as usual', async () => {
    const microAppElement2 = document.createElement('micro-app')
    microAppElement2.setAttribute('name', 'test-app2')
    microAppElement2.setAttribute('url', `http://127.0.0.1:${ports.micro_app_element}/ssr-render/`)
    // 兼容旧版本baseurl
    microAppElement2.setAttribute('baseurl', '/baseurl')

    appCon.appendChild(microAppElement2)

    await new Promise((resolve) => {
      microAppElement2.addEventListener('mounted', () => {
        expect(appInstanceMap.get('test-app2')).toBeInstanceOf(CreateApp)
        resolve(true)
      }, false)
    })
  })

  // 由于预加载异步延迟3s执行，即便app name相同，
  test('render prefetch app before prefetch work', async () => {
    const microAppElement3 = document.createElement('micro-app')
    microAppElement3.setAttribute('name', 'test-app1')
    microAppElement3.setAttribute('url', `http://127.0.0.1:${ports.micro_app_element}/ssr-render/`)

    await new Promise((resolve) => {
      microAppElement3.addEventListener('mounted', () => {
        expect(document.getElementById('app2-iframe1')).toBeInstanceOf(HTMLIFrameElement)
        resolve(true)
      }, false)
      appCon.appendChild(microAppElement3)
    })
  })

  // name冲突
  test('test conflict of app name', async () => {
    const microAppElement4 = document.createElement('micro-app')
    microAppElement4.setAttribute('name', 'test-app1')
    microAppElement4.setAttribute('url', `http://127.0.0.1:${ports.micro_app_element}/common/`)

    appCon.appendChild(microAppElement4)

    await new Promise((resolve) => {
      defer(() => {
        expect(jestConsoleError).toHaveBeenCalledWith('[micro-app] app name conflict, an app named: test-app1 with url: http://127.0.0.1:9002/ssr-render/ is running')
        resolve(true)
      })
    })
  })

  // 非法url
  test('it should log error when url is invalid', async () => {
    const microAppElement5 = document.createElement('micro-app')
    microAppElement5.setAttribute('name', 'test-app2')
    microAppElement5.setAttribute('url', 'abc')

    appCon.appendChild(microAppElement5)

    await new Promise((resolve) => {
      defer(() => {
        expect(jestConsoleError).toBeCalledTimes(2)
        resolve(true)
      })
    })
  })

  // 修改name或url失败
  test('it should deal with an error when change name or url failed', async () => {
    const microAppElement6 = document.createElement('micro-app')
    microAppElement6.setAttribute('name', 'test-app6')
    microAppElement6.setAttribute('url', `http://127.0.0.1:${ports.micro_app_element}/common/`)

    microAppElement6.setAttribute('name', 'test-app2')
    microAppElement6.setAttribute('url', `http://127.0.0.1:${ports.micro_app_element}/ssr-render/`)

    // micro-app元素还没插入到文档中时，可以随时修改name和url
    expect(microAppElement6.getAttribute('name')).toBe('test-app2')
    expect(microAppElement6.getAttribute('url')).toBe(`http://127.0.0.1:${ports.micro_app_element}/ssr-render/`)

    await new Promise((resolve) => {
      appCon.appendChild(microAppElement6)
      defer(() => {
        expect(jestConsoleError).toBeCalled()
        resolve(true)
      })
    })
  })

  // 多次调用microApp.start方法抛出错误
  test('it should log error when microApp.start exec repeatedly', () => {
    microApp.start()
    expect(jestConsoleError).toBeCalledWith('[micro-app] microApp.start executed repeatedly')
  })

  // 覆盖修改name/url属性的一些特殊分支
  test('coverage special branch when change attribute name/url', async () => {
    const microAppElement7 = document.createElement('micro-app')
    microAppElement7.setAttribute('name', 'test-app7')
    microAppElement7.setAttribute('url', `http://127.0.0.1:${ports.micro_app_element}/common/`)

    appCon.appendChild(microAppElement7)
    await new Promise((resolve) => {
      microAppElement7.addEventListener('mounted', () => {
        resolve(true)
      }, false)
    })

    microAppElement7.setAttribute('name', 'new-name') // 设置新name
    microAppElement7.setAttribute('name', 'test-app7') // 之后立即恢复之前的值，因为回调是异步处理的，所以会发现属性name和实例名称name是一致的，以此来覆盖某个分支

    await new Promise((resolve) => {
      defer(() => {
        expect(microAppElement7.getAttribute('name')).toBe('test-app7')
        microAppElement7.setAttribute('name', 'new-name')
        resolve(true)
      })
    })

    const microAppElement8 = document.createElement('micro-app')
    microAppElement8.setAttribute('name', 'test-app8')
    microAppElement8.setAttribute('url', `http://127.0.0.1:${ports.micro_app_element}/common/`)

    appCon.appendChild(microAppElement8)
    await new Promise((resolve) => {
      microAppElement8.addEventListener('mounted', () => {
        resolve(true)
      }, false)
    })

    microAppElement8.setAttribute('url', 'abc') // 无效的url

    await new Promise((resolve) => {
      defer(() => {
        expect(microAppElement8.getAttribute('url')).toBe('abc')
        // @ts-ignore
        expect(microAppElement8.appUrl).toBe(`http://127.0.0.1:${ports.micro_app_element}/common/`)
        resolve(true)
      })
    })

    appInstanceMap.delete('test-app8')
    appCon.removeChild(microAppElement8)
  })

  // 重新渲染带有shadowDom和baseurl属性应用 -- 分支覆盖
  test('coverage branch of remount app with shadowDom & baseurl', async () => {
    const microAppElement10 = document.createElement('micro-app')
    microAppElement10.setAttribute('name', 'test-app10')
    microAppElement10.setAttribute('url', `http://127.0.0.1:${ports.micro_app_element}/common/`)
    microAppElement10.setAttribute('shadowDom', 'true')
    microAppElement10.setAttribute('baseurl', '/baseurl')

    appCon.appendChild(microAppElement10)
    await new Promise((resolve) => {
      microAppElement10.addEventListener('mounted', () => {
        resolve(true)
      }, false)
    })

    appCon.removeChild(microAppElement10)

    appCon.appendChild(microAppElement10)

    // 分支覆盖
    const microAppElement11 = document.createElement('micro-app')
    microAppElement11.setAttribute('name', 'test-app11')
    microAppElement11.setAttribute('url', `http://127.0.0.1:${ports.micro_app_element}/common/`)

    appCon.appendChild(microAppElement11)
    await new Promise((resolve) => {
      microAppElement11.addEventListener('mounted', () => {
        resolve(true)
      }, false)
    })

    appCon.removeChild(microAppElement11)

    appCon.appendChild(microAppElement11)
  })

  // 修改name或url成功，且修改后的应用为预加载或已经卸载的应用，此时直接从缓存中重新挂载
  test('change name or url to an exist prefetch/unmount app ', async () => {
    const microAppElement13 = document.createElement('micro-app')
    microAppElement13.setAttribute('name', 'test-app13')
    microAppElement13.setAttribute('url', `http://127.0.0.1:${ports.micro_app_element}/dynamic/`)

    appCon.appendChild(microAppElement13)
    await new Promise((resolve) => {
      function handleMounted () {
        microAppElement13.removeEventListener('mounted', handleMounted)
        // test-app12# 会格式化为 test-app12
        microAppElement13.setAttribute('name', 'test-app12#')
        defer(() => {
          expect(microAppElement13.getAttribute('name')).toBe('test-app12')
        })
        microAppElement13.setAttribute('url', `http://127.0.0.1:${ports.micro_app_element}/common`)
        resolve(true)
      }
      microAppElement13.addEventListener('mounted', handleMounted, false)
    })

    await new Promise((resolve) => {
      defer(() => {
        expect(appInstanceMap.get('test-app12')?.isPrefetch).toBeFalsy()
        resolve(true)
      })
    })
  })

  // getBaseRouteCompatible 分支覆盖
  test('coverage branch of getBaseRouteCompatible', async () => {
    const microAppElement14 = document.createElement('micro-app')
    microAppElement14.setAttribute('name', 'test-app14')
    microAppElement14.setAttribute('url', `http://127.0.0.1:${ports.micro_app_element}/common/`)
    microAppElement14.setAttribute('baseroute', '/path')

    appCon.appendChild(microAppElement14)
    await new Promise((resolve) => {
      microAppElement14.addEventListener('mounted', () => {
        resolve(true)
      }, false)
    })
  })

  // 先插入micro-app元素，后设置name、url属性
  test('set name & url after connectedCallback', async () => {
    const microAppElement15 = document.createElement('micro-app')
    appCon.appendChild(microAppElement15)

    microAppElement15.setAttribute('name', 'test-app15')
    microAppElement15.setAttribute('url', `http://127.0.0.1:${ports.micro_app_element}/common/`)

    await new Promise((resolve) => {
      microAppElement15.addEventListener('mounted', () => {
        resolve(true)
      }, false)
    })
  })

  // 当新的app与旧的app name相同而url不同时，且旧app已经卸载，则删除旧app的缓存，使用新app覆盖
  test('overwrite unmount app when name conflicts', async () => {
    const microAppElement16 = document.createElement('micro-app')
    microAppElement16.setAttribute('name', 'test-app16')
    microAppElement16.setAttribute('url', `http://127.0.0.1:${ports.micro_app_element}/common`)

    appCon.appendChild(microAppElement16)

    await new Promise((resolve) => {
      microAppElement16.addEventListener('mounted', () => {
        appCon.removeChild(microAppElement16)
        resolve(true)
      })
    })

    const microAppElement17 = document.createElement('micro-app')
    // name相同，url不同
    microAppElement17.setAttribute('name', 'test-app16')
    microAppElement17.setAttribute('url', `http://127.0.0.1:${ports.micro_app_element}/dynamic/`)

    appCon.appendChild(microAppElement17)

    await new Promise((resolve) => {
      microAppElement17.addEventListener('mounted', () => {
        expect(appInstanceMap.get('test-app16')!.url).toBe(`http://127.0.0.1:${ports.micro_app_element}/dynamic/`)
        resolve(true)
      })
    })
  })

  // 测试一些带有特殊符号的name
  test('test name with special characters', async () => {
    // scene1: 格式化后name为空
    const microAppElement18 = document.createElement('micro-app')
    microAppElement18.setAttribute('name', '123$')
    expect(jestConsoleError).toBeCalledWith('[micro-app] Invalid attribute name 123$')

    // scene2: 前后name不一致，重新赋值
    const microAppElement19 = document.createElement('micro-app')
    microAppElement19.setAttribute('name', 'test-app19$')
    expect(microAppElement19.getAttribute('name')).toBe('test-app19')
  })

  // 测试ssr配置
  test('test ssr mode', async () => {
    const microAppElement20 = document.createElement('micro-app')
    microAppElement20.setAttribute('name', 'test-app20')
    microAppElement20.setAttribute('url', `http://127.0.0.1:${ports.micro_app_element}/common`)
    microAppElement20.setAttribute('ssr', 'true')

    // 场景1: 测试正常渲染的ssr应用
    appCon.appendChild(microAppElement20)

    await new Promise((resolve) => {
      setTimeout(() => {
        // TODO: 优化，ssrUrl的地址有点奇怪
        // connectedCallback中会对url地址进行格式化，因为jest环境下，location.pathname 默认为 '/'，所以/common被截掉
        expect(microAppElement20.ssrUrl).not.toBeNull()
        resolve(true)
      }, 1000)
    })

    // 场景2: 再次渲染时，去除ssr配置，如果有 ssrUrl，则进行删除
    appCon.removeChild(microAppElement20)
    microAppElement20.removeAttribute('ssr')
    appCon.appendChild(microAppElement20)

    await new Promise((resolve) => {
      setTimeout(() => {
        expect(microAppElement20.ssrUrl).toBe('')
        resolve(true)
      }, 100)
    })

    // 场景3: ssr模式下动态修改url的值，此时ssrUrl会进行同步更新
    appCon.removeChild(microAppElement20)
    microAppElement20.setAttribute('ssr', 'true')
    appCon.appendChild(microAppElement20)

    await new Promise((resolve) => {
      microAppElement20.addEventListener('mounted', () => {
        microAppElement20.setAttribute('url', `http://127.0.0.1:${ports.micro_app_element}/dynamic/`)
        defer(() => {
          // TODO: 优化，ssrUrl的地址有点奇怪
          expect(microAppElement20.ssrUrl).not.toBeNull()
          resolve(true)
        })
      })
    })

    // 场景4: ssr模式已经渲染，修改url的值的同时去除ssr配置，需要将ssrUrl的值删除
    const microAppElement21 = document.createElement('micro-app')
    microAppElement21.setAttribute('name', 'test-app21')
    microAppElement21.setAttribute('url', `http://127.0.0.1:${ports.micro_app_element}/common`)
    microAppElement21.setAttribute('ssr', 'true')

    appCon.appendChild(microAppElement21)

    await new Promise((resolve) => {
      microAppElement21.addEventListener('mounted', () => {
        microAppElement21.removeAttribute('ssr')
        microAppElement21.setAttribute('url', `http://127.0.0.1:${ports.micro_app_element}/dynamic/`)
        defer(() => {
          expect(microAppElement21.ssrUrl).toBe('')
          resolve(true)
        })
      })
    })
  })

  // test keep-alive 场景1: 正常渲染、隐藏、重新渲染
  test('normal process of keep-alive', async () => {
    const microAppElement22 = document.createElement('micro-app')
    microAppElement22.setAttribute('name', 'test-app22')
    microAppElement22.setAttribute('url', `http://127.0.0.1:${ports.micro_app_element}/common/`)
    microAppElement22.setAttribute('keep-alive', 'true')

    appCon.appendChild(microAppElement22)

    await new Promise((resolve) => {
      microAppElement22.addEventListener('mounted', () => {
        resolve(true)
      })
    })

    const beforeShowListener = jest.fn()
    const afterShowListener = jest.fn()
    const afterHiddenListener = jest.fn()

    microAppElement22.addEventListener('beforeshow', beforeShowListener)
    microAppElement22.addEventListener('aftershow', afterShowListener)
    microAppElement22.addEventListener('afterhidden', afterHiddenListener)

    appCon.removeChild(microAppElement22)
    // dispatch event afterhidden to base app and micro app
    expect(afterHiddenListener).toBeCalledWith(expect.any(CustomEvent))
    expect(window.keepAliveListener).toBeCalledWith('afterhidden')

    appCon.appendChild(microAppElement22)

    await new Promise((resolve) => {
      // TODO: appendChild之后用defer包裹依然不能让下面的代码在应用创建后执行，应该是mount方法中的defer的问题，需要验证一下
      setTimeout(() => {
        // dispatch event beforeshow to base app and micro app
        expect(beforeShowListener).toBeCalledWith(expect.any(CustomEvent))
        expect(window.keepAliveListener).toBeCalledWith('beforeshow')

        // dispatch event aftershow to base app and micro app
        expect(afterShowListener).toBeCalledWith(expect.any(CustomEvent))
        expect(window.keepAliveListener).toBeCalledWith('aftershow')
        resolve(true)
      }, 100)
    })

    // 分支覆盖之 keep-alive 模式下开启 shadowRoot
    appCon.removeChild(microAppElement22)
    microAppElement22.setAttribute('shadowDom', 'true')
    appCon.appendChild(microAppElement22)
  })

  // test keep-alive 场景2: 二次渲染时，url冲突，卸载旧应用，重新渲染
  test('url conflict when remount of keep-alive', async () => {
    const microAppElement23 = document.createElement('micro-app')
    microAppElement23.setAttribute('name', 'test-app23')
    microAppElement23.setAttribute('url', `http://127.0.0.1:${ports.micro_app_element}/common/`)
    microAppElement23.setAttribute('keep-alive', 'true')

    appCon.appendChild(microAppElement23)

    await new Promise((resolve) => {
      microAppElement23.addEventListener('mounted', () => {
        resolve(true)
      })
    })

    appCon.removeChild(microAppElement23)

    const microAppElement24 = document.createElement('micro-app')
    microAppElement24.setAttribute('name', 'test-app23')
    microAppElement24.setAttribute('url', `http://127.0.0.1:${ports.micro_app_element}/dynamic/`)

    appCon.appendChild(microAppElement24)

    await new Promise((resolve) => {
      setTimeout(() => {
        expect(jestConsoleError).toHaveBeenCalledWith('[micro-app] app name conflict, an app named: test-app23 with url: http://127.0.0.1:9002/common/ is running')
        resolve(true)
      }, 100)
    })
  })

  // test keep-alive 场景3: 修改micro-app name、url属性相关操作
  test('url conflict when remount of keep-alive', async () => {
    const microAppElement25 = document.createElement('micro-app')
    microAppElement25.setAttribute('name', 'test-app25')
    microAppElement25.setAttribute('url', `http://127.0.0.1:${ports.micro_app_element}/dynamic/`)
    microAppElement25.setAttribute('keep-alive', 'true')

    appCon.appendChild(microAppElement25)

    await new Promise((resolve) => {
      microAppElement25.addEventListener('mounted', () => {
        resolve(true)
      })
    })

    // afterhidden事件指向test-app25
    const afterHiddenListenerForTestApp25 = jest.fn()
    microAppElement25.addEventListener('afterhidden', afterHiddenListenerForTestApp25)

    // beforeshow和aftershow事件指向test-app23
    const beforeShowListenerForTestApp23 = jest.fn()
    const afterShowListenerForTestApp23 = jest.fn()
    microAppElement25.addEventListener('beforeshow', beforeShowListenerForTestApp23)
    microAppElement25.addEventListener('aftershow', afterShowListenerForTestApp23)

    // 修改name和url
    microAppElement25.setAttribute('name', 'test-app23')
    microAppElement25.setAttribute('url', `http://127.0.0.1:${ports.micro_app_element}/common/`)

    await new Promise((resolve) => {
      // name和url的修改是异步的，这里放在定时器中执行
      setTimeout(() => {
        // dispatch event afterhidden to base app
        expect(afterHiddenListenerForTestApp25).toBeCalledWith(expect.any(CustomEvent))

        // dispatch event beforeshow to base app
        expect(beforeShowListenerForTestApp23).toBeCalledWith(expect.any(CustomEvent))

        // dispatch event aftershow to base app
        expect(afterShowListenerForTestApp23).toBeCalledWith(expect.any(CustomEvent))

        resolve(true)
      }, 50)
    })

    // 修改name为test-app25，test-app25为隐藏状态，但url没有修改，此时url冲突，keep-alive报错
    microAppElement25.setAttribute('name', 'test-app25')

    await new Promise((resolve) => {
      defer(() => {
        expect(jestConsoleError).toHaveBeenCalledWith('[micro-app] app name conflict, an app named test-app25 is running')
        resolve(true)
      })
    })
  })
})
