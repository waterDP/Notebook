const METADATA_INJECT_KEY = 'METADATA_INJECT_KEY'
import 'reflect-metadata'
export function Injector(token) {
  return function(target, key, paramsIndex) {
    Reflect.defineMetadata(METADATA_INJECT_KEY, token, target, 'index-'+paramsIndex)
    return target
  }
}

export function getInjectionToken(target, index) {
  return Reflect.getMetadata(METADATA_INJECT_KEY, target, 'index-'+index)
}