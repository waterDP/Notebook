import 'reflect-metadata'

const INJECTABLE_METADATA_KEY  = Symbol('INJECTTABLE_KEY')

export function Injectable() {
  return function(target: any) {
    Reflect.defineMetadata(INJECTABLE_METADATA_KEY, true, target)
    return target
  }
}