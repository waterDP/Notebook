/*
 * @Author: water.li
 * @Date: 2022-04-08 00:10:49
 * @Description: 
 * @FilePath: \notebook\Vue\vue-next\packages\shared\src\index.ts
 */

export function isObject(value: unknown): value is Record<any, any> {
  return typeof value === 'object' && value !== null
}