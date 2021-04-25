/*
 * @Description: 
 * @Date: 2021-04-25 16:37:16
 * @Author: water.li
 */
async function asyncPool(poolLimit, array, iteratorFn) {
  const ret = []
  const executing = []  // 存储正在执行的异步任务
  for (const item of array) {
    const p = Promise.resolve().then(() => iteratorFn(item, array))
    ret.push(p)

    if (poolLimit <= array.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1))
      executing.push(e)
      if (executing.length >= poolLimit) {
        await Promise.race(executing) // 等待最快的任务执行完成
      }
    }
  }
  return Promise.all(ret)
}