import {token} from './token'
import {parse} from './parse'

/**
 * @param rc require.context传的文件
 * @param {string} redirect 需要根路由重定向的路由
 * @param {string} rootFile 多么级别.vue存放的文件夹名称
 * @return {array}
 */
export default function ({rc, redirect, rootFile='view'}) {
  if (!rc) {
    throw new Error('rc为必传参数')
  }
  const allRouters = token(rc)
  const result = parse(allRouters)
  redirect && result.unshift({path: '/', redirect})
  return result
}

