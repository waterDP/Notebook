/*
 * @lc app=leetcode.cn id=2121 lang=javascript
 *
 * [2121] 相同元素的间隔之和
 *
 * https://leetcode-cn.com/problems/intervals-between-identical-elements/description/
 *
 * algorithms
 * Medium (34.51%)
 * Likes:    27
 * Dislikes: 0
 * Total Accepted:    4.2K
 * Total Submissions: 12.1K
 * Testcase Example:  '[2,1,3,1,2,3,3]'
 *
 * 给你一个下标从 0 开始、由 n 个整数组成的数组 arr 。
 * 
 * arr 中两个元素的 间隔 定义为它们下标之间的 绝对差 。更正式地，arr[i] 和 arr[j] 之间的间隔是 |i - j| 。
 * 
 * 返回一个长度为 n 的数组 intervals ，其中 intervals[i] 是 arr[i] 和 arr 中每个相同元素（与 arr[i]
 * 的值相同）的 间隔之和 。
 * 
 * 注意：|x| 是 x 的绝对值。
 * 
 * 
 * 
 * 示例 1：
 * 
 * 输入：arr = [2,1,3,1,2,3,3]
 * 输出：[4,2,7,2,4,4,5]
 * 解释：
 * - 下标 0 ：另一个 2 在下标 4 ，|0 - 4| = 4
 * - 下标 1 ：另一个 1 在下标 3 ，|1 - 3| = 2
 * - 下标 2 ：另两个 3 在下标 5 和 6 ，|2 - 5| + |2 - 6| = 7
 * - 下标 3 ：另一个 1 在下标 1 ，|3 - 1| = 2
 * - 下标 4 ：另一个 2 在下标 0 ，|4 - 0| = 4
 * - 下标 5 ：另两个 3 在下标 2 和 6 ，|5 - 2| + |5 - 6| = 4
 * - 下标 6 ：另两个 3 在下标 2 和 5 ，|6 - 2| + |6 - 5| = 5
 * 
 * 
 * 示例 2：
 * 
 * 输入：arr = [10,5,10,10]
 * 输出：[5,0,3,4]
 * 解释：
 * - 下标 0 ：另两个 10 在下标 2 和 3 ，|0 - 2| + |0 - 3| = 5
 * - 下标 1 ：只有这一个 5 在数组中，所以到相同元素的间隔之和是 0
 * - 下标 2 ：另两个 10 在下标 0 和 3 ，|2 - 0| + |2 - 3| = 3
 * - 下标 3 ：另两个 10 在下标 0 和 2 ，|3 - 0| + |3 - 2| = 4
 * 
 * 
 * 
 * 
 * 提示：
 * 
 * 
 * n == arr.length
 * 1 <= n <= 10^5
 * 1 <= arr[i] <= 10^5
 * 
 * 
 */

// @lc code=start
/**
 * @param {number[]} arr
 * @return {number[]}
 */
var getDistances = function (arr) {
  let map = {};
  for (let i = 0; i < arr.length; i++) {
    map[arr[i]] = map[arr[i]] || [];
    map[arr[i]].push(i);
  }
  let ret = [];
  for (let key in map) {
    let tmp = map[key];
    let prev = [];
    prev[-1] = 0;
    for (let i = 0; i < tmp.length; i++) {
      prev[i] = prev[i - 1] + +tmp[i];
    }
    for (let i = 0; i < tmp.length; i++) {
      let qian = (i == 0 ? 0 : (+tmp[i] * i - prev[i - 1]));
      let hou = (i == tmp.length - 1 ? 0 : ((prev[tmp.length - 1] - prev[i]) - +tmp[i] * (tmp.length - 1 - i)));

      ret[tmp[i]] = +qian + +hou;
    }
  }
  return ret
};
// @lc code=end

