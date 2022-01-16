/*
 * @Description: 
 * @Date: 2021-04-25 16:37:16
 * @Author: water.li
 */
async function asyncPool(poolLimit, array, iteratorFn) {
  const ret = []
  const executing = []
  for (const item of array) {
    const p = Promise.resolve().then(() => iteratorFn(item, array))
    ret.push(p)
    if (poolLimit <= array.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1))
      executing.push(e)
      if (executing.length >= poolLimit) {
        await Promise.race(executing)
      }
    }
  }
  return Promise.all(ret)
}