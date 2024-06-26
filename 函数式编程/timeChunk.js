/*
 * @Author: water.li
 * @Date: 2021-09-29 22:34:31
 * @Description: 
 * @FilePath: \notebook\函数式编程\timeChunk.js
 */
// todo 分时函数
// 分时函数的原理是让创建节点的工作分批进行，比如把1s创建1000个节点，改为第200ms创建8个节点

const timeChunk = (arr, fn, count = 10, delay = 200) => {
  let start = function() {
    const min = Math.min(count, arr.length)
    for (let i = 0; i < min; i++) {
      let obj = arr.shift()
      fn(obj)
    }
  }
  return () => {
    let t = setInterval(() => {
      if (arr.length === 0) {
        return clearInterval(t)
      }
      start()
    }, delay)
  }
}

// apply
let arr = []
for (let i = 0; i < 2000; i++) {
  arr.push(i)
}
let renderFriendList = timeChunk(arr, n => {
  let div = document.createElement('div')
  div.innerHTML = n
  document.body.appendChild(div)
}, 10)
renderFriendList()
