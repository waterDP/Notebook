import type {
  MicroLocation,
  PopStateListener,
  MicroPopStateEvent,
  microAppWindowType,
} from '@micro-app/types'
import {
  appInstanceMap,
  isIframeSandbox,
} from '../../create_app'
import {
  getActiveApps,
} from '../../micro_app'
import {
  getMicroPathFromURL,
  getMicroState,
  getMicroRouterInfoState,
  isEffectiveApp,
  isRouterModeCustom,
} from './core'
import {
  updateMicroLocation,
} from './location'
import {
  removeDomScope,
  isFunction,
  macro,
  getRootContainer,
} from '../../libs/utils'
import globalEnv from '../../libs/global_env'

/**
 * dispatch PopStateEvent & HashChangeEvent to child app
 * each child app will listen for popstate event when sandbox start
 * and release it when sandbox stop
 * @param appName app name
 * @returns release callback
 */
export function addHistoryListener (appName: string): CallableFunction {
  const rawWindow = globalEnv.rawWindow
  // handle popstate event and distribute to child app
  const popStateHandler: PopStateListener = (e: MicroPopStateEvent): void => {
    /**
     * 1. unmount app & hidden keep-alive app will not receive popstate event
     * 2. filter out onlyForBrowser
     */
    if (
      getActiveApps({
        excludeHiddenApp: true,
        excludePreRender: true,
      }).includes(appName) &&
      !e.onlyForBrowser
    ) {
      /**
       * base app may respond to popstateEvent async(lazy load page & browser back/forward), but child app will respond to popstateEvent immediately(vue2, react), this will cause some problems
       * 2 solutions:
       *  1. child app respond to popstateEvent async -- router-event-delay
       *  2. child app will not respond to popstateEvent in some scenarios (history.state===null || history.state?__MICRO_APP_STATE__[appName])
       * NOTE 1:
       *  1. browser back/forward
       *  2. location.hash/search/pathname = xxx
       *  3. <a href="/#/xxx">, <a href="/xxx">
       *  4. history.back/go/forward
       *  5. history.pushState/replaceState
       *
       * NOTE2:
       *  1、react16 hash mode navigate by location.hash = xxx, history.state is always null, but react16 respond to popstateEvent sync
       *  2、multiple child apps may has problems
       */
      if (
        !isRouterModeCustom(appName) ||
        !globalEnv.rawWindow.history.state ||
        getMicroRouterInfoState(appName)
      ) {
        const container = appInstanceMap.get(appName)?.container
        macro(
          () => updateMicroLocationWithEvent(appName, getMicroPathFromURL(appName)),
          (container && getRootContainer(container))?.getRouterEventDelay() ?? 0
        )
      }
    }
  }

  rawWindow.addEventListener('popstate', popStateHandler)

  return () => {
    rawWindow.removeEventListener('popstate', popStateHandler)
  }
}

/**
 * Effect: use to trigger child app jump
 * Actions:
 *  1. update microLocation with target path
 *  2. dispatch popStateEvent & hashChangeEvent
 * @param appName app name
 * @param targetFullPath target path of child app
 */
export function updateMicroLocationWithEvent (
  appName: string,
  targetFullPath: string | null,
): void {
  const app = appInstanceMap.get(appName)
  if (app?.sandBox) {
    const proxyWindow = app.sandBox.proxyWindow
    const microAppWindow = app.sandBox.microAppWindow
    let isHashChange = false
    // for hashChangeEvent
    const oldHref = proxyWindow.location.href
    // Do not attach micro state to url when targetFullPath is empty
    if (targetFullPath) {
      const oldHash = proxyWindow.location.hash
      updateMicroLocation(appName, targetFullPath, microAppWindow.location as MicroLocation)
      isHashChange = proxyWindow.location.hash !== oldHash
    }

    // dispatch formatted popStateEvent to child
    dispatchPopStateEventToMicroApp(appName, proxyWindow, microAppWindow)

    // dispatch formatted hashChangeEvent to child when hash change
    if (isHashChange) dispatchHashChangeEventToMicroApp(appName, proxyWindow, microAppWindow, oldHref)

    // clear element scope before trigger event of next app
    removeDomScope()
  }
}

/**
 * dispatch formatted popstate event to microApp
 * @param appName app name
 * @param proxyWindow sandbox window
 * @param eventState history.state
 */
export function dispatchPopStateEventToMicroApp (
  appName: string,
  proxyWindow: WindowProxy,
  microAppWindow: microAppWindowType,
): void {
  /**
   * TODO: test
   * angular14 takes e.type as type judgment
   * when e.type is popstate-appName popstate event will be invalid
   * Object.defineProperty(newPopStateEvent, 'type', {
   *    value: 'popstate',
   *    writable: true,
   *    configurable: true,
   *    enumerable: true,
   * })
   */
  /**
   * create PopStateEvent named popstate-appName with sub app state
   * TODO: feeling like there's something wrong, check carefully
   *  In native mode, getMicroState(appName) return rawWindow.history.state when use microApp.router.push/replace or other scenes when state.__MICRO_APP_STATE__[appName] is null
   */
  const newPopStateEvent = new PopStateEvent(
    'popstate',
    { state: getMicroState(appName) }
  )

  microAppWindow.dispatchEvent(newPopStateEvent)

  if (!isIframeSandbox(appName)) {
    // call function window.onpopstate if it exists
    isFunction(proxyWindow.onpopstate) && proxyWindow.onpopstate(newPopStateEvent)
  }
}

/**
 * dispatch formatted hashchange event to microApp
 * @param appName app name
 * @param proxyWindow sandbox window
 * @param oldHref old href
 */
export function dispatchHashChangeEventToMicroApp (
  appName: string,
  proxyWindow: WindowProxy,
  microAppWindow: microAppWindowType,
  oldHref: string,
): void {
  const newHashChangeEvent = new HashChangeEvent(
    'hashchange',
    {
      newURL: proxyWindow.location.href,
      oldURL: oldHref,
    }
  )

  microAppWindow.dispatchEvent(newHashChangeEvent)

  if (!isIframeSandbox(appName)) {
    // call function window.onhashchange if it exists
    isFunction(proxyWindow.onhashchange) && proxyWindow.onhashchange(newHashChangeEvent)
  }
}

/**
 * dispatch native PopStateEvent, simulate location behavior
 * @param onlyForBrowser only dispatch PopStateEvent to browser
 */
function dispatchNativePopStateEvent (onlyForBrowser: boolean): void {
  const event = new PopStateEvent('popstate', { state: null }) as MicroPopStateEvent
  if (onlyForBrowser) event.onlyForBrowser = true
  globalEnv.rawWindow.dispatchEvent(event)
}

/**
 * dispatch hashchange event to browser
 * @param oldHref old href of rawWindow.location
 */
function dispatchNativeHashChangeEvent (oldHref: string): void {
  const newHashChangeEvent = new HashChangeEvent(
    'hashchange',
    {
      newURL: globalEnv.rawWindow.location.href,
      oldURL: oldHref,
    }
  )

  globalEnv.rawWindow.dispatchEvent(newHashChangeEvent)
}

/**
 * dispatch popstate & hashchange event to browser
 * @param appName app.name
 * @param onlyForBrowser only dispatch event to browser
 * @param oldHref old href of rawWindow.location
 */
export function dispatchNativeEvent (
  appName: string,
  onlyForBrowser: boolean,
  oldHref?: string,
): void {
  // clear element scope before dispatch global event
  removeDomScope()
  if (isEffectiveApp(appName)) {
    dispatchNativePopStateEvent(onlyForBrowser)
    if (oldHref) {
      dispatchNativeHashChangeEvent(oldHref)
    }
  }
}
