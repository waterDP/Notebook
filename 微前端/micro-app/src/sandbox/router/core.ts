import type {
  MicroLocation,
  MicroState,
  MicroRouterInfoState,
  LocationQuery,
  HandleMicroPathResult,
} from '@micro-app/types'
import globalEnv from '../../libs/global_env'
import {
  assign,
  parseQuery,
  stringifyQuery,
  isString,
  isUndefined,
  isPlainObject,
  createURL,
  isEmptyObject,
} from '../../libs/utils'
import {
  appInstanceMap,
} from '../../create_app'
import {
  ROUTER_MODE_LIST,
  DEFAULT_ROUTER_MODE,
  ROUTER_MODE_STATE,
  ROUTER_MODE_NATIVE,
  ROUTER_MODE_NATIVE_SCOPE,
  ROUTER_MODE_PURE,
} from '../../constants'
import microApp from '../../micro_app'

// set micro app state to origin state
export function setMicroState (
  appName: string,
  microState?: MicroState,
  targetLocation?: MicroLocation,
): MicroState {
  // TODO: 验证native模式下修改state nextjs路由是否正常
  const rawState = globalEnv.rawWindow.history.state
  const additionalState: Record<'__MICRO_APP_STATE__', Record<string, MicroRouterInfoState>> = {
    __MICRO_APP_STATE__: assign({}, rawState?.__MICRO_APP_STATE__, {
      [appName]: {
        fullPath: targetLocation ? targetLocation.pathname + targetLocation.search + targetLocation.hash : null,
        state: microState ?? null,
        mode: getRouterMode(appName),
      }
    }),
  }

  // create new state object
  return assign({}, rawState, additionalState)
}

// delete micro app state form origin state
export function removeMicroState (appName: string, rawState: MicroState): MicroState {
  if (isPlainObject(rawState?.__MICRO_APP_STATE__)) {
    if (!isUndefined(rawState.__MICRO_APP_STATE__[appName])) {
      delete rawState.__MICRO_APP_STATE__[appName]
    }
    if (!Object.keys(rawState.__MICRO_APP_STATE__).length) {
      delete rawState.__MICRO_APP_STATE__
    }
  }

  return !isEmptyObject(rawState) ? assign({}, rawState) : null
}

// get micro app state form origin state
export function getMicroState (appName: string): MicroState {
  const rawState = globalEnv.rawWindow.history.state
  return rawState?.__MICRO_APP_STATE__?.[appName]?.state || null
}

// get micro app router info state form origin state
export function getMicroRouterInfoState (appName: string): MicroRouterInfoState | null {
  const rawState = globalEnv.rawWindow.history.state
  return rawState?.__MICRO_APP_STATE__?.[appName] || null
}

const ENC_AD_RE = /&/g // %M1
const ENC_EQ_RE = /=/g // %M2
const DEC_AD_RE = /%M1/g // &
const DEC_EQ_RE = /%M2/g // =

// encode path with special symbol
export function encodeMicroPath (path: string): string {
  return encodeURIComponent(commonDecode(path).replace(ENC_AD_RE, '%M1').replace(ENC_EQ_RE, '%M2'))
}

// decode path
export function decodeMicroPath (path: string): string {
  return commonDecode(path).replace(DEC_AD_RE, '&').replace(DEC_EQ_RE, '=')
}

// Recursively resolve address
function commonDecode (path: string): string {
  try {
    const decPath = decodeURIComponent(path)
    if (path === decPath || DEC_AD_RE.test(decPath) || DEC_EQ_RE.test(decPath)) return decPath
    return commonDecode(decPath)
  } catch {
    return path
  }
}

// Format the query parameter key to prevent conflicts with the original parameters
function formatQueryAppName (appName: string) {
  // return `app-${appName}`
  return appName
}

/**
 * Get app fullPath from browser url
 * @param appName app.name
 */
export function getMicroPathFromURL (appName: string): string | null {
  const rawLocation = globalEnv.rawWindow.location
  const rawState = globalEnv.rawWindow.history.state
  if (isRouterModeSearch(appName)) {
    const queryObject = getQueryObjectFromURL(rawLocation.search, rawLocation.hash)
    const microPath = queryObject.hashQuery?.[formatQueryAppName(appName)] || queryObject.searchQuery?.[formatQueryAppName(appName)]
    return isString(microPath) ? decodeMicroPath(microPath) : null
  }
  /**
   * Get fullPath from __MICRO_APP_STATE__
   * NOTE:
   *  1. state mode: all base on __MICRO_APP_STATE__
   *  2. pure mode: navigate by location.xxx may contain one-time information in __MICRO_APP_STATE__
   *  3. native mode: vue-router@4 will exec replaceState with history.state before pushState, like:
   *    history.replaceState(
   *      assign({}, history.state, {...}),
   *      title,
   *      history.state.current, <---
   *    )
   *    when base app jump to another page from child page, it will replace child path with base app path
   *   e.g: base-home --> child-home --> child-about(will replace with child-home before jump to base-home) --> base-home, when go back, it will back to child-home not child-about
   *   So we take the fullPath as standard
   */
  // 问题：1、同一个页面多个子应用，一个修改后... --- native模式不支持多个子应用同时渲染，多个子应用推荐使用其它模式
  // if (isRouterModeCustom(appName)) {
  //   return rawLocation.pathname + rawLocation.search + rawLocation.hash
  // }
  // return rawState?.__MICRO_APP_STATE__?.[appName]?.fullPath || null
  return rawState?.__MICRO_APP_STATE__?.[appName]?.fullPath || (isRouterModeCustom(appName) ? rawLocation.pathname + rawLocation.search + rawLocation.hash : null)
}

/**
 * Attach child app fullPath to browser url
 * @param appName app.name
 * @param targetLocation location of child app or rawLocation of window
 */
export function setMicroPathToURL (appName: string, targetLocation: MicroLocation): HandleMicroPathResult {
  const rawLocation = globalEnv.rawWindow.location
  let targetFullPath = targetLocation.pathname + targetLocation.search + targetLocation.hash
  let isAttach2Hash = false
  if (isRouterModeSearch(appName)) {
    let { pathname, search, hash } = rawLocation
    const queryObject = getQueryObjectFromURL(search, hash)
    const encodedMicroPath = encodeMicroPath(targetFullPath)

    /**
     * Is parent is hash router
     * In fact, this is not true. It just means that the parameter is added to the hash
     */
    // If hash exists and search does not exist, it is considered as a hash route
    if (hash && !search) {
      isAttach2Hash = true
      // TODO: 这里和下面的if判断可以简化一下
      if (queryObject.hashQuery) {
        queryObject.hashQuery[formatQueryAppName(appName)] = encodedMicroPath
      } else {
        queryObject.hashQuery = {
          [formatQueryAppName(appName)]: encodedMicroPath
        }
      }
      const baseHash = hash.includes('?') ? hash.slice(0, hash.indexOf('?') + 1) : hash + '?'
      hash = baseHash + stringifyQuery(queryObject.hashQuery)
    } else {
      if (queryObject.searchQuery) {
        queryObject.searchQuery[formatQueryAppName(appName)] = encodedMicroPath
      } else {
        queryObject.searchQuery = {
          [formatQueryAppName(appName)]: encodedMicroPath
        }
      }
      search = '?' + stringifyQuery(queryObject.searchQuery)
    }

    return {
      fullPath: pathname + search + hash,
      isAttach2Hash,
    }
  }

  if (isRouterModeState(appName) || isRouterModePure(appName)) {
    targetFullPath = rawLocation.pathname + rawLocation.search + rawLocation.hash
  }

  return {
    fullPath: targetFullPath,
    isAttach2Hash,
  }
}

/**
 * Delete child app fullPath from browser url
 * @param appName app.name
 */
export function removeMicroPathFromURL (appName: string): HandleMicroPathResult {
  let { pathname, search, hash } = globalEnv.rawWindow.location
  let isAttach2Hash = false

  if (isRouterModeSearch(appName)) {
    const queryObject = getQueryObjectFromURL(search, hash)
    if (queryObject.hashQuery?.[formatQueryAppName(appName)]) {
      isAttach2Hash = true
      delete queryObject.hashQuery?.[formatQueryAppName(appName)]
      const hashQueryStr = stringifyQuery(queryObject.hashQuery)
      hash = hash.slice(0, hash.indexOf('?') + Number(Boolean(hashQueryStr))) + hashQueryStr
    } else if (queryObject.searchQuery?.[formatQueryAppName(appName)]) {
      delete queryObject.searchQuery?.[formatQueryAppName(appName)]
      const searchQueryStr = stringifyQuery(queryObject.searchQuery)
      search = searchQueryStr ? '?' + searchQueryStr : ''
    }
  }

  return {
    fullPath: pathname + search + hash,
    isAttach2Hash,
  }
}

/**
 * Format search, hash to object
 */
function getQueryObjectFromURL (search: string, hash: string): LocationQuery {
  const queryObject: LocationQuery = {}

  if (search !== '' && search !== '?') {
    queryObject.searchQuery = parseQuery(search.slice(1))
  }

  if (hash.includes('?')) {
    queryObject.hashQuery = parseQuery(hash.slice(hash.indexOf('?') + 1))
  }

  return queryObject
}

/**
 * get microApp path from browser URL without hash
 */
export function getNoHashMicroPathFromURL (appName: string, baseUrl: string): string {
  const microPath = getMicroPathFromURL(appName)
  if (!microPath) return ''
  const formatLocation = createURL(microPath, baseUrl)
  return formatLocation.origin + formatLocation.pathname + formatLocation.search
}

/**
 * Effect app is an app that can perform route navigation
 * NOTE: Invalid app action
 * 1. prevent update browser url, dispatch popStateEvent, reload browser
 * 2. It can update path with pushState/replaceState
 * 3. Can not update path outside (with router api)
 * 3. Can not update path by location
 */
export function isEffectiveApp (appName: string): boolean {
  const app = appInstanceMap.get(appName)
  /**
   * !!(app && !app.isPrefetch && !app.isHidden())
   * NOTE: 隐藏的keep-alive应用暂时不作为无效应用，原因如下
   * 1、隐藏后才执行去除浏览器上的微应用的路由信息的操作，导致微应用的路由信息无法去除
   * 2、如果保持隐藏应用内部正常跳转，阻止同步路由信息到浏览器，这样理论上是好的，但是对于location跳转改如何处理？location跳转是基于修改浏览器地址后发送popstate事件实现的，所以应该是在隐藏后不支持通过location进行跳转
   */
  return !!(app && !app.isPrefetch)
}

/**
 * get router mode of app
 * NOTE: app maybe undefined
 */
function getRouterMode (appName: string): string | undefined {
  return appInstanceMap.get(appName)?.routerMode
}

// router mode is search
export function isRouterModeSearch (appName: string): boolean {
  return getRouterMode(appName) === DEFAULT_ROUTER_MODE
}

// router mode is state
export function isRouterModeState (appName: string): boolean {
  return getRouterMode(appName) === ROUTER_MODE_STATE
}

// router mode is history
export function isRouterModeNative (appName: string): boolean {
  return getRouterMode(appName) === ROUTER_MODE_NATIVE
}

// router mode is disable
export function isRouterModeNativeScope (appName: string): boolean {
  return getRouterMode(appName) === ROUTER_MODE_NATIVE_SCOPE
}

// router mode is pure
export function isRouterModePure (appName: string): boolean {
  return getRouterMode(appName) === ROUTER_MODE_PURE
}

/**
 * router mode is history or disable
 */
export function isRouterModeCustom (appName: string): boolean {
  return isRouterModeNative(appName) || isRouterModeNativeScope(appName)
}

/**
 * get memory router mode of child app
 * NOTE:
 *  1. if microAppElement exists, it means the app render by the micro-app element
 *  2. if microAppElement not exists, it means it is prerender app
 * @param mode native config
 * @param inlineDisableMemoryRouter disable-memory-router set by micro-app element or prerender
 * @returns router mode
 */
export function initRouterMode (
  mode: string | null | void,
  inlineDisableMemoryRouter?: boolean,
): string {
  /**
   * compatible with disable-memory-router in older versions
   * if disable-memory-router is true, router-mode will be disable
   * Priority:
   *  inline disable-memory-router > inline router-mode > global disable-memory-router > global router-mode
   */
  const routerMode = (
    (inlineDisableMemoryRouter && ROUTER_MODE_NATIVE) ||
    mode ||
    (microApp.options['disable-memory-router'] && ROUTER_MODE_NATIVE) ||
    microApp.options['router-mode'] ||
    DEFAULT_ROUTER_MODE
  )
  return ROUTER_MODE_LIST.includes(routerMode) ? routerMode : DEFAULT_ROUTER_MODE
}
