/*
 * @Author: water.li
 * @Date: 2025-04-27 22:19:57
 * @Description: 
 * @FilePath: \Notebook\JavaScript\singleton.js
 */

export function singleton(className) {
  let instance

  const proxy = new Proxy(className, {
    construct(target, args) {
      if (!instance) {
        instance = new Reflect.construct(target, args)
      }
      return instance
    }
  })

  proxy.prototype.constructor = proxy

  return proxy
}