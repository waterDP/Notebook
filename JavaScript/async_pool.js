/*
 * @Description:
 * @Date: 2021-04-25 16:37:16
 * @Author: water.li
 */
async function asyncPool(poolLimit, arr, iteratorFn) {
  const ret = [];
  const executing = [];
  for (const item of arr) {
    const p = Promise.resolve().then(() => iteratorFn(item, arr));
    ret.push(p);
    if (poolLimit <= arr.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      console.log(executing);
      if (executing.length >= poolLimit) {
        await Promise.race(executing);
      }
    }
  }
  return Promise.all(ret);
}

// todo test
const createPromiseTask = (delay) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(delay);
    }, delay);
  });
};

asyncPool(
  3,
  [
    createPromiseTask(2000),
    createPromiseTask(1000),
    createPromiseTask(3000),
    createPromiseTask(2000),
    createPromiseTask(3000),
    createPromiseTask(4000),
    createPromiseTask(5000),
    createPromiseTask(3000),
    createPromiseTask(1000),
  ],
  (item, arr) => item.then(console.log)
);
