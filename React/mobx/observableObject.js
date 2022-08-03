import { getNextId, addHiddenProp, $mobx, getAdm, globalState } from './utils'

class ObservableValue {
  constructor(value) {
    this.value = value
    this.observers = new Set() // 此可观察的值的监听者 也可以说是观察者
  }
  get() {
    reportObserved(this)
    return this.value
  }
  setNewValue(newValue) {
    this.value = newValue
    propagateChanged(this)
  }
}

function reportObserved(observableValue) {
  const { observers } = observableValue
  observers.forEach(observer => {
    observer.runReaction()
  })
}

// 广播变化
function propagateChanged(observableValue) {
  const trackingDerivation = globalState.trackingDerivation
  if (trackingDerivation) {
    trackingDerivation.observing.push(observableValue)
  }
}

class ObservableObjectAdministration {
  constructor(target, values, name) {
    this.target = target
    this.values = values
    this.name = name
  }
  get(key) {
    return this.target[key]
  }
  set(key, value) {
    if (this.values.has(key)) {
      return this.setObservablePropValue(key, value)
    }
  }
  extend(key, descriptor) {
    this.defineObservableProperty(key, descriptor.value)
  }
  setObservablePropValue(key, value) {
    const observableValue = this.values.get(key)
    observableValue.setNewValue(value)
    return true
  }
  getObservablePropValue(key) {
    return this.values.get(key).get()
  }
  defineObservableProperty(key, value) {
    const descriptor = {
      configurable: true,
      enumerable: true,
      get() {
        return this[$mobx].getObservablePropValue(key)
      },
      set() {
        return this[$mobx].setObservablePropValue(key, value)
      }
    }
    Object.defineProperty(this.target, key, descriptor)
    this.values.set(key, new ObservalueValue(value))
  }
}

function asObervableObject(target) {
  const name = `ObservableObject@${getNextId()}`
  const adm = new ObservableObjectAdministration(
    target, new Map(), name
  )
  addHiddenProp(target, $mobx, adm)
  return target
}

const objectProxyTraps = {
  get(target, name) {
    return getAdm(target).get(name)
  },
  set(target, name, value) {
    return getAdm(target).set(name, value)
  }
}

function asDynamicObservableObject(target) {
  asObervableObject(target)
  const proxy = new Proxy(target, objectProxyTraps)
  return proxy
}

function extendObservable(proxyObject, properties) {
  const descriptors = Object.getOwnPropertyDescriptors(properties)
  const adm = proxyObject[$mobx]
  Reflect.ownKeys(descriptors).forEach(key => {
    adm.extend(key, descriptors[key])
  })
  return proxyObject
}

export function object(target) {
  const dynamicObservableObject = asDynamicObservableObject({})
  return extendObservable(dynamicObservableObject, target)
}