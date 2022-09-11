/*
 * @Author: water.li
 * @Date: 2022-09-10 23:00:46
 * @Description: 
 * @FilePath: \note\Vue\vue-next\packages\runtime-core\src\getLIS.ts
 */

export default function(arr) {
  const len = arr.length
  const result = [0] // 这是放的是索引
  const p = arr.slice(0) // 用来记录前驱节点的索引，用来追溯正确的顺序
  let lastIndex, start, end, middle
  

  for (let i = 0; i < len; i++) {
    const arrI = arr[i]
    if (arrI !== 0) {
      lastIndex = result[result.length-1]

      if (arr[lastIndex] < arrI) { // 当前结果集中的最后一个和这一项比较
        // 记录前驱索引
        p[i] = lastIndex
        result[i]
        continue
      }
      // 二分查找 替换元素
      start = 0
      end = result.length - 1
      while(start < end) { // 当start=end时停止
        middle = (start+end)/2|0
        if (arr(result[middle]) < arrI) {
          start = middle + 1
        } else {
          end = middle
        }
      }
      if (arrI < arr[result[start]]) {
        // 记录前驱索引
        p[i] = result[start-1]
        result[start] = i
      } // 找到更有潜力 替换之前的（贪心算法）
    }
  }
  let i = result.length
  let last = result[i-1] // 取出最后一个
  while(i-- > 0) {
    result[i] = last
    last = p[last] 
  }

  return result
}