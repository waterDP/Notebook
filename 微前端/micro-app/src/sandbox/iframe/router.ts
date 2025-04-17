import type {
  microAppWindowType,
  MicroLocation,
} from '@micro-app/types'
import {
  createMicroLocation,
  updateMicroLocation,
} from '../router/location'
import {
  createMicroHistory,
} from '../router/history'
import {
  assign,
  createURL,
  rawDefineProperties,
} from '../../libs/utils'
import globalEnv from '../../libs/global_env'

export function patchRouter (
  appName: string,
  url: string,
  microAppWindow: microAppWindowType,
  browserHost: string,
): MicroLocation {
  const rawHistory = globalEnv.rawWindow.history
  const childStaticLocation = createURL(url)
  const childHost = childStaticLocation.protocol + '//' + childStaticLocation.host
  const childFullPath = childStaticLocation.pathname + childStaticLocation.search + childStaticLocation.hash

  // rewrite microAppWindow.history
  const microHistory = microAppWindow.history
  // save history.replaceState, it will be used in updateMicroLocation
  microAppWindow.rawReplaceState = microHistory.replaceState
  // rewrite microAppWindow.history
  assign(microHistory, createMicroHistory(appName, microAppWindow.location))
  // scrollRestoration proxy to rawHistory
  rawDefineProperties(microHistory, {
    scrollRestoration: {
      configurable: true,
      enumerable: true,
      get () {
        return rawHistory.scrollRestoration
      },
      set (value: string) {
        rawHistory.scrollRestoration = value
      }
    }
  })

  /**
   * Init microLocation before exec sandbox.start
   * NOTE:
   *  1. exec updateMicroLocation after patch microHistory
   *  2. sandbox.start will sync microLocation info to browser url
   */
  updateMicroLocation(
    appName,
    childFullPath,
    microAppWindow.location,
    'prevent'
  )

  // create proxyLocation
  return createMicroLocation(
    appName,
    url,
    microAppWindow,
    childStaticLocation,
    browserHost,
    childHost,
  )
}
