/*
 * @Author: water.li
 * @Date: 2022-04-16 20:38:02
 * @Description: 
 * @FilePath: \note\LeetCode\1705.吃苹果的最大数目.js
 */
/*
 * @lc app=leetcode.cn id=1705 lang=javascript
 *
 * [1705] 吃苹果的最大数目
 */




// @lc code=start
/**
 * @param {number[]} apples
 * @param {number[]} days
 * @return {number}
 */
var eatenApples = function(apples, days) {
  let ans = 0
  let queue = new PriorityQueue((a, b) => a[0] - b[0])
  for (let d = 0; ;d++) {
    const outDay = days[d] + d
    const apple = apples[d]
    if (outDay > 0 && apple > 0) {
      queue.put([outDay, apple])
    }
    while (!queue.isEmpty()) {
      const entry = queue.head
      if (entry) {
        const [outDay, apple] = entry
        if (outDay <= d || apple <= 0) {
          queue.shift()
        } else {
          entry[1]-- // 吃苹果
          ans++
          break  // 跳出本次循环，一天只吃一个苹果
        }
      }
    }

    if (queue.isEmpty() && d > days.length) break
  }
  return ans
};

/**
 * 优先队列
 */
class PriorityQueue {
  constructor(comparison) {
    this.data = []
    this.comparison = comparison
  }
  put(entry) {
    if (this.isEmpty()) {
      this.data.push(entry)
    } else {
      let isInsert = false
      for (let i = 0; i < this.data.length; i++) {
        const entryLess = this.comparison(this.data[i], entry) > 0
        if (entryLess) {
          isInsert = true
          this.data.splice(i, 0, entry)
          break
        }
      }
      if (!isInsert) {
        this.data.push(entry)
      }
    }
  }
  shift() {
    if (this.isEmpty()) return
    return this.data.shift()
  }
  isEmpty() {
    return this.data.length === 0
  }
  get length() {
    return this.data.length
  }
  get head() {
    return this.data[0]
  }
}

// @lc code=end

