/* eslint-disable no-return-assign */
import {
  isBoundFunction,
  isConstructor,
  rawDefineProperty,
  isBoolean,
  isFunction,
} from '../libs/utils'

function isBoundedFunction (value: CallableFunction & {__MICRO_APP_IS_BOUND_FUNCTION__: boolean}): boolean {
  if (isBoolean(value.__MICRO_APP_IS_BOUND_FUNCTION__)) return value.__MICRO_APP_IS_BOUND_FUNCTION__
  return value.__MICRO_APP_IS_BOUND_FUNCTION__ = isBoundFunction(value)
}

function isConstructorFunction (value: FunctionConstructor & {__MICRO_APP_IS_CONSTRUCTOR__: boolean}) {
  if (isBoolean(value.__MICRO_APP_IS_CONSTRUCTOR__)) return value.__MICRO_APP_IS_CONSTRUCTOR__
  return value.__MICRO_APP_IS_CONSTRUCTOR__ = isConstructor(value)
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function bindFunctionToRawTarget<T = Window, B = unknown> (value: any, rawTarget: T, key = 'WINDOW'): B {
  /**
   * In safari, nest app like: A -> B -> C
   * if B is iframe sandbox, and C is with sandbox, same property of document in C is abnormal
   * e.g:
   *  document.all:
   *    - typeof document.all ==> 'function'
   *    - document.all.bind ==> undefined
   */
  if (isFunction(value) && !isConstructorFunction(value) && !isBoundedFunction(value) && value.bind) {
    const cacheKey = `__MICRO_APP_BOUND_${key}_FUNCTION__`
    if (value[cacheKey]) return value[cacheKey]

    const bindRawObjectValue = value.bind(rawTarget)

    for (const key in value) {
      bindRawObjectValue[key] = value[key]
    }

    if (value.hasOwnProperty('prototype')) {
      rawDefineProperty(bindRawObjectValue, 'prototype', {
        value: value.prototype,
        configurable: true,
        enumerable: false,
        writable: true,
      })
    }

    return value[cacheKey] = bindRawObjectValue
  }

  return value
}
