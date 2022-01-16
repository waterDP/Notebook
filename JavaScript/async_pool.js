/*
 * @Description: 
 * @Date: 2021-04-25 16:37:16
 * @Author: water.li
 */
async function asyncPool(poolLimit, arr, iteratorFn) {
  const ret = []
  const executing = []
  for (const item of arr) {
    const p = Promise.resolve().then(() => iteratorFn(item, arr))
    ret.push(p)
    if (poolLimit <= arr.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1))
      executing.push(e)
      if (executing.length >= poolLimit) {
        await Promise.race(executing)
      }
    }
  }
  return Promise.all(ret)
}