import type {
  Func,
  Router,
  RouterTarget,
  navigationMethod,
  MicroLocation,
  RouterGuard,
  GuardLocation,
  AccurateGuard,
  SetDefaultPageOptions,
  AttachAllToURLParam,
  AppInterface,
} from '@micro-app/types'
import {
  encodeMicroPath,
  decodeMicroPath,
  setMicroPathToURL,
  setMicroState,
  getMicroState,
  getMicroPathFromURL,
  isRouterModeSearch,
  isRouterModePure,
  isRouterModeState,
} from './core'
import {
  logError,
  logWarn,
  formatAppName,
  createURL,
  isFunction,
  isPlainObject,
  useSetRecord,
  useMapRecord,
  requestIdleCallback,
  isString,
  noopFalse,
  removeDomScope,
  isObject,
} from '../../libs/utils'
import { appInstanceMap } from '../../create_app'
import { getActiveApps } from '../../micro_app'
import globalEnv from '../../libs/global_env'
import { navigateWithNativeEvent, attachRouteToBrowserURL } from './history'
import bindFunctionToRawTarget from '../bind_function'
import { updateMicroLocationWithEvent } from './event'

export interface RouterApi {
  router: Router,
  executeNavigationGuard: (appName: string, to: GuardLocation, from: GuardLocation) => void
  clearRouterWhenUnmount: (appName: string) => void
}

export interface CreteBaseRouter {
  setBaseAppRouter (baseRouter: unknown): void
  getBaseAppRouter(): unknown
}

export interface CreateDefaultPage {
  setDefaultPage(options: SetDefaultPageOptions): () => boolean
  removeDefaultPage(appName: string): boolean
  getDefaultPage(key: PropertyKey): string | void
}

function createRouterApi (): RouterApi {
  /**
   * common handler for router.push/router.replace method
   * @param appName app name
   * @param methodName replaceState/pushState
   * @param targetLocation target location
   * @param state to.state
   */
  function navigateWithRawHistory (
    appName: string,
    methodName: string,
    targetLocation: MicroLocation,
    state: unknown,
  ): void {
    navigateWithNativeEvent(
      appName,
      methodName,
      setMicroPathToURL(
        appName,
        targetLocation,
      ),
      false,
      setMicroState(
        appName,
        state ?? null,
        targetLocation,
      ),
    )
    // clear element scope after navigate
    removeDomScope()
  }

  /**
   * navigation handler
   * @param appName app.name
   * @param app app instance
   * @param to router target options
   * @param replace use router.replace?
   */
  function handleNavigate (
    appName: string,
    app: AppInterface,
    to: RouterTarget,
    replace: boolean,
  ): void {
    const microLocation = app.sandBox!.proxyWindow.location as MicroLocation
    const targetLocation = createURL(to.path, microLocation.href)
    // Only get path data, even if the origin is different from microApp
    const currentFullPath = microLocation.pathname + microLocation.search + microLocation.hash
    const targetFullPath = targetLocation.pathname + targetLocation.search + targetLocation.hash
    if (currentFullPath !== targetFullPath || getMicroPathFromURL(appName) !== targetFullPath) {
      // pure mode will not call history.pushState/replaceState
      if (!isRouterModePure(appName)) {
        const methodName = (replace && to.replace !== false) || to.replace === true ? 'replaceState' : 'pushState'
        navigateWithRawHistory(appName, methodName, targetLocation, to.state)
      }
      // only search mode will dispatch PopStateEvent to browser
      if (!isRouterModeSearch(appName)) {
        updateMicroLocationWithEvent(appName, targetFullPath)
      }
    }
  }

  /**
   * create method of router.push/replace
   * NOTE:
   * 1. The same fullPath will be blocked
   * 2. name & path is required
   * 3. path is fullPath except for the domain (the domain can be taken, but not valid)
   * @param replace use router.replace?
   */
  function createNavigationMethod (replace: boolean): navigationMethod {
    return function (to: RouterTarget): Promise<void> {
      return new Promise((resolve, reject) => {
        const appName = formatAppName(to.name)
        if (appName && isString(to.path)) {
          /**
           * active apps, exclude prerender app or hidden keep-alive app
           * NOTE:
           *  1. prerender app or hidden keep-alive app clear and record popstate event, so we cannot control app jump through the API
           *  2. disable memory-router
           */
          /**
           * TODO:
           *  1、子应用开始渲染但是还没渲染完成，调用跳转改如何处理
           *  2、iframe的沙箱还没初始化时执行跳转报错，如何处理。。。
           *  3、hidden app、预渲染 app 是否支持跳转 --- 支持（这里还涉及子应用内部跳转的支持）
           */
          if (getActiveApps({ excludeHiddenApp: true, excludePreRender: true }).includes(appName)) {
            const app = appInstanceMap.get(appName)!
            resolve(app.sandBox.sandboxReady.then(() => handleNavigate(appName, app, to, replace)))
          } else {
            reject(logError('导航失败，请确保子应用渲染后再调用此方法'))
          }

          // const rawLocation = globalEnv.rawWindow.location
          // const targetLocation = createURL(to.path, rawLocation.origin)
          // const targetFullPath = targetLocation.pathname + targetLocation.search + targetLocation.hash
          // if (getMicroPathFromURL(appName) !== targetFullPath) {
          //   navigateWithRawHistory(
          //     appName,
          //     to.replace === false ? 'pushState' : 'replaceState',
          //     targetLocation,
          //     to.state,
          //   )
          // }
        } else {
          reject(logError(`navigation failed, name & path are required when use router.${replace ? 'replace' : 'push'}`))
        }
      })
    }
  }

  // create method of router.go/back/forward
  function createRawHistoryMethod (methodName: string): Func {
    return function (...rests: unknown[]): void {
      return globalEnv.rawWindow.history[methodName](...rests)
    }
  }

  const beforeGuards = useSetRecord<RouterGuard>()
  const afterGuards = useSetRecord<RouterGuard>()

  /**
   * run all of beforeEach/afterEach guards
   * NOTE:
   * 1. Modify browser url first, and then run guards,
   *    consistent with the browser forward & back button
   * 2. Prevent the element binding
   * @param appName app name
   * @param to target location
   * @param from old location
   * @param guards guards list
   */
  function runGuards (
    appName: string,
    to: GuardLocation,
    from: GuardLocation,
    guards: Set<RouterGuard>,
  ) {
    // clear element scope before execute function of parent
    removeDomScope()
    for (const guard of guards) {
      if (isFunction(guard)) {
        guard(to, from, appName)
      } else if (isPlainObject(guard) && isFunction((guard as AccurateGuard)[appName])) {
        guard[appName](to, from)
      }
    }
  }

  /**
   * global hook for router
   * update router information base on microLocation
   * @param appName app name
   * @param microLocation location of microApp
   */
  function executeNavigationGuard (
    appName: string,
    to: GuardLocation,
    from: GuardLocation,
  ): void {
    router.current.set(appName, to)

    runGuards(appName, to, from, beforeGuards.list())

    requestIdleCallback(() => {
      runGuards(appName, to, from, afterGuards.list())
    })
  }

  function clearRouterWhenUnmount (appName: string): void {
    router.current.delete(appName)
  }

  /**
   * NOTE:
   * 1. app not exits
   * 2. sandbox is disabled
   * 3. router mode is custom
   */
  function commonHandlerForAttachToURL (appName: string): void {
    if (isRouterModeSearch(appName) || isRouterModeState(appName)) {
      const app = appInstanceMap.get(appName)!
      attachRouteToBrowserURL(
        appName,
        setMicroPathToURL(appName, app.sandBox.proxyWindow.location as MicroLocation),
        setMicroState(appName, getMicroState(appName), app.sandBox.proxyWindow.location as MicroLocation),
      )
    }
  }

  /**
   * Attach specified active app router info to browser url
   * @param appName app name
   */
  function attachToURL (appName: string): void {
    appName = formatAppName(appName)
    if (appName && getActiveApps().includes(appName)) {
      commonHandlerForAttachToURL(appName)
    }
  }

  /**
   * Attach all active app router info to browser url
   * @param includeHiddenApp include hidden keep-alive app
   * @param includePreRender include preRender app
   */
  function attachAllToURL ({
    includeHiddenApp = false,
    includePreRender = false,
  }: AttachAllToURLParam): void {
    getActiveApps({
      excludeHiddenApp: !includeHiddenApp,
      excludePreRender: !includePreRender,
    }).forEach(appName => commonHandlerForAttachToURL(appName))
  }

  function createDefaultPageApi (): CreateDefaultPage {
    // defaultPage data
    const defaultPageRecord = useMapRecord<string>()

    /**
     * defaultPage only effect when mount, and has lower priority than query on browser url
     * SetDefaultPageOptions {
     *   @param name app name
     *   @param path page path
     * }
     */
    function setDefaultPage (options: SetDefaultPageOptions): () => boolean {
      const appName = formatAppName(options.name)
      if (!appName || !options.path) {
        if (__DEV__) {
          if (!appName) {
            logWarn(`setDefaultPage: invalid appName "${appName}"`)
          } else {
            logWarn('setDefaultPage: path is required')
          }
        }
        return noopFalse
      }

      return defaultPageRecord.add(appName, options.path)
    }

    function removeDefaultPage (appName: string): boolean {
      appName = formatAppName(appName)
      if (!appName) return false

      return defaultPageRecord.delete(appName)
    }

    return {
      setDefaultPage,
      removeDefaultPage,
      getDefaultPage: defaultPageRecord.get,
    }
  }

  function createBaseRouterApi (): CreteBaseRouter {
    /**
     * Record base app router, let child app control base app navigation
     */
    let baseRouterProxy: unknown = null
    function setBaseAppRouter (baseRouter: unknown): void {
      if (isObject(baseRouter)) {
        baseRouterProxy = new Proxy(baseRouter, {
          get (target: History, key: PropertyKey): unknown {
            removeDomScope()
            return bindFunctionToRawTarget(Reflect.get(target, key), target, 'BASEROUTER')
          },
          set (target: History, key: PropertyKey, value: unknown): boolean {
            Reflect.set(target, key, value)
            return true
          }
        })
      } else if (__DEV__) {
        logWarn('setBaseAppRouter: Invalid base router')
      }
    }

    return {
      setBaseAppRouter,
      getBaseAppRouter: () => baseRouterProxy,
    }
  }

  // Router API for developer
  const router: Router = {
    current: new Map<string, MicroLocation>(),
    encode: encodeMicroPath,
    decode: decodeMicroPath,
    push: createNavigationMethod(false),
    replace: createNavigationMethod(true),
    go: createRawHistoryMethod('go'),
    back: createRawHistoryMethod('back'),
    forward: createRawHistoryMethod('forward'),
    beforeEach: beforeGuards.add,
    afterEach: afterGuards.add,
    attachToURL,
    attachAllToURL,
    ...createDefaultPageApi(),
    ...createBaseRouterApi(),
  }

  return {
    router,
    executeNavigationGuard,
    clearRouterWhenUnmount,
  }
}

export const {
  router,
  executeNavigationGuard,
  clearRouterWhenUnmount,
} = createRouterApi()
