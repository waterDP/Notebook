export const $mobx = Symbol('mobx administration')

export function isObject(value) {
  return value !== null && typeof value === 'object'
}

let mobxGuid = 0
export function getNextId() {
  return ++mobxGuid
}

export function addHiddenProp(obj, propName, value) {
  Object.defineProperty(obj, propName, {
    enumerable: false,
    writable: true,
    configurable: false,
    value
  })
}

export function getAdm(target) {
  return target[$mobx]
}

export const globalState = {
  pendingReactions: [],
  trackingDerivation: null
}