/*
 * @Author: water.li
 * @Date: 2024-09-15 20:52:41
 * @Description: 
 * @FilePath: \Notebook\JavaScript\async_once.js
 */

export function asyncOnce(cb) {
  const map = {}
  return (...args) => {
    return new Promise((resolve, reject) => {
      const key = JSON.stringify(args)
      if (!map[key]) {
        map[key] = {
          resolve: [],
          reject: [],
          isPending: false
        }
      }
      const state = map[key]
      state.resolve.push(resolve)
      state.reject.push(reject)
      if (state.isPending) return
      state.isPending = true
      cb(...args)
        .then(res => {
          state.resolve.forEach(resolve => resolve(res))
        })
        .catch(err => {
          state.reject.forEach(reject => reject(err))
        })
        .finally(() => {
          map[key] = null
        })
    })
  }
}