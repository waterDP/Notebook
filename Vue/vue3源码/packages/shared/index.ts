/*
 * @Author: water.li
 * @Date: 2021-10-31 19:57:34
 * @LastEditTime: 2021-11-01 09:51:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \notebook\Vue\vue3源码\packages\shared\index.ts
 */

export function isObject(target) {
  return typeof target === 'object' && target != null
}

export const extend = Object.assign