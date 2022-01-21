/*
 * @Author: water.li
 * @Date: 2022-01-21 22:18:51
 * @Description: 
 * @FilePath: \notebook\LeetCode\475.供暖器.js
 */
/*
 * @lc app=leetcode.cn id=475 lang=javascript
 *
 * [475] 供暖器
 *
 * https://leetcode-cn.com/problems/heaters/description/
 *
 * algorithms
 * Medium (40.18%)
 * Likes:    367
 * Dislikes: 0
 * Total Accepted:    51K
 * Total Submissions: 126.6K
 * Testcase Example:  '[1,2,3]\n[2]'
 *
 * 冬季已经来临。 你的任务是设计一个有固定加热半径的供暖器向所有房屋供暖。
 * 
 * 在加热器的加热半径范围内的每个房屋都可以获得供暖。
 * 
 * 现在，给出位于一条水平线上的房屋 houses 和供暖器 heaters 的位置，请你找出并返回可以覆盖所有房屋的最小加热半径。
 * 
 * 说明：所有供暖器都遵循你的半径标准，加热的半径也一样。
 * 
 * 
 * 
 * 示例 1:
 * 
 * 
 * 输入: houses = [1,2,3], heaters = [2]
 * 输出: 1
 * 解释: 仅在位置2上有一个供暖器。如果我们将加热半径设为1，那么所有房屋就都能得到供暖。
 * 
 * 
 * 示例 2:
 * 
 * 
 * 输入: houses = [1,2,3,4], heaters = [1,4]
 * 输出: 1
 * 解释: 在位置1, 4上有两个供暖器。我们需要将加热半径设为1，这样所有房屋就都能得到供暖。
 * 
 * 
 * 示例 3：
 * 
 * 
 * 输入：houses = [1,5], heaters = [2]
 * 输出：3
 * 
 * 
 * 
 * 
 * 提示：
 * 
 * 
 * 1 
 * 1 
 * 
 * 
 */

// @lc code=start
/**
 * @param {number[]} houses
 * @param {number[]} heaters
 * @return {number}
 */
var search = (heaters, house) => {
  let [left, right] = [0, heaters.length-1]
  // 最小的供暖器都在目标房屋的左边
  // 否则说明房屋左边没有合适的供暖器，用-1代替
  if (heaters[left] > house) return -1
  while (left < right) {
    const mid = ((right-left+1)>>1) + left
    if (heaters[mid] > house) {
      right = mid -1
    } else {
      left = mid
    }
  }
  return left
}

var findRadius = function(houses, heaters) {
  let r = 0
  heaters.sort((a, b) => a-b)
  const n = heaters.length
  for (const house of houses) {
    const i = search(heaters, house)
    const j = i + 1
    const left = i < 0 ? Infinity : house-heaters[i]
    const right = j >= n ? Infinity : heaters[j] - house
    r = Math.max(r, Math.min(left, right))
  }
  return r
};
// @lc code=end

