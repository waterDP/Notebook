/*
 * @Author: water.li
 * @Date: 2022-09-21 22:14:27
 * @Description: 
 * @FilePath: \note\LeetCode\517.超级洗衣机.js
 */
/*
 * @lc app=leetcode.cn id=517 lang=javascript
 *
 * [517] 超级洗衣机
 *
 * https://leetcode.cn/problems/super-washing-machines/description/
 *
 * algorithms
 * Hard (51.04%)
 * Likes:    239
 * Dislikes: 0
 * Total Accepted:    22.4K
 * Total Submissions: 43.9K
 * Testcase Example:  '[1,0,5]'
 *
 * 假设有 n 台超级洗衣机放在同一排上。开始的时候，每台洗衣机内可能有一定量的衣服，也可能是空的。
 * 
 * 在每一步操作中，你可以选择任意 m (1 <= m <= n) 台洗衣机，与此同时将每台洗衣机的一件衣服送到相邻的一台洗衣机。
 * 
 * 给定一个整数数组 machines 代表从左至右每台洗衣机中的衣物数量，请给出能让所有洗衣机中剩下的衣物的数量相等的 最少的操作步数
 * 。如果不能使每台洗衣机中衣物的数量相等，则返回 -1 。
 * 
 * 
 * 
 * 示例 1：
 * 
 * 
 * 输入：machines = [1,0,5]
 * 输出：3
 * 解释：
 * 第一步:    1     0 <-- 5    =>    1     1     4
 * 第二步:    1 <-- 1 <-- 4    =>    2     1     3    
 * 第三步:    2     1 <-- 3    =>    2     2     2   
 * 
 * 
 * 示例 2：
 * 
 * 
 * 输入：machines = [0,3,0]
 * 输出：2
 * 解释：
 * 第一步:    0 <-- 3     0    =>    1     2     0    
 * 第二步:    1     2 --> 0    =>    1     1     1     
 * 
 * 
 * 示例 3：
 * 
 * 
 * 输入：machines = [0,2,0]
 * 输出：-1
 * 解释：
 * 不可能让所有三个洗衣机同时剩下相同数量的衣物。
 * 
 * 
 * 
 * 
 * 提示：
 * 
 * 
 * n == machines.length
 * 1 <= n <= 10^4
 * 0 <= machines[i] <= 10^5
 * 
 * 
 */

// @lc code=start
/**
 * @param {number[]} machines
 * @return {number}
 */
var findMinMoves = function(machines) {
  const total = eval(machines.join('+'))
  const n = machines.length
  if (total % n !== 0) {
    return -1
  }
  let avg = total / n | 0
  let ans = 0, sum = 0
  for (let num of machines) {
    num -= avg
    sum += num
    ans = Math.max(ans, Math.max(Math.abs(sum), num))
  }
  return ans 
};
// @lc code=end

