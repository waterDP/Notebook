import type { lifeCyclesType, AppInterface } from '@micro-app/types'
import microApp from '../micro_app'
import {
  logWarn,
  isFunction,
  removeDomScope,
  getRootContainer,
  assign,
  formatEventType,
} from '../libs/utils'

function formatEventInfo (event: CustomEvent, element: HTMLElement): void {
  Object.defineProperties(event, {
    currentTarget: {
      get () {
        return element
      }
    },
    target: {
      get () {
        return element
      }
    },
  })
}

type LifecycleEventName = keyof lifeCyclesType

/**
 * dispatch lifeCycles event to base app
 * created, beforemount, mounted, unmount, error
 * @param element container
 * @param appName app.name
 * @param lifecycleName lifeCycle name
 * @param error param from error hook
 */
export default function dispatchLifecyclesEvent (
  element: HTMLElement | ShadowRoot | null,
  appName: string,
  lifecycleName: LifecycleEventName,
  error?: Error,
): void {
  if (!element) {
    return logWarn(`element does not exist in lifecycle ${lifecycleName}`, appName)
  }

  element = getRootContainer(element)

  // clear dom scope before dispatch lifeCycles event to base app, especially mounted & unmount
  removeDomScope()

  const detail = assign({
    name: appName,
    container: element,
  }, error && {
    error
  })

  const event = new CustomEvent(lifecycleName, {
    detail,
  })

  formatEventInfo(event, element)
  // global hooks
  if (isFunction(microApp.options.lifeCycles?.[lifecycleName])) {
    microApp.options.lifeCycles![lifecycleName]!(event, appName)
  }

  element.dispatchEvent(event)
}

/**
 * Dispatch custom event to micro app
 * @param app app
 * @param eventName event name ['mounted', 'unmount', 'appstate-change', 'statechange']
 * @param detail event detail
 */
export function dispatchCustomEventToMicroApp (
  app: AppInterface,
  eventName: string,
  detail: Record<string, any> = {},
): void {
  const event = new CustomEvent(formatEventType(eventName, app.name), {
    detail,
  })

  app.sandBox?.microAppWindow.dispatchEvent(event)
}
