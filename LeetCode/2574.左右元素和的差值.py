'''
Author: water.li
Date: 2023-03-13 23:28:44
Description: 
FilePath: \Notebook\LeetCode\2574.左右元素和的差值.py
'''
#
# @lc app=leetcode.cn id=2574 lang=python3
#
# [2574] 左右元素和的差值
#
# https://leetcode.cn/problems/left-and-right-sum-differences/description/
#
# algorithms
# Easy (86.69%)
# Likes:    8
# Dislikes: 0
# Total Accepted:    8.8K
# Total Submissions: 10.2K
# Testcase Example:  '[10,4,8,3]'
#
# 给你一个下标从 0 开始的整数数组 nums ，请你找出一个下标从 0 开始的整数数组 answer ，其中：
#
#
# answer.length == nums.length
# answer[i] = |leftSum[i] - rightSum[i]|
#
#
# 其中：
#
#
# leftSum[i] 是数组 nums 中下标 i 左侧元素之和。如果不存在对应的元素，leftSum[i] = 0 。
# rightSum[i] 是数组 nums 中下标 i 右侧元素之和。如果不存在对应的元素，rightSum[i] = 0 。
#
#
# 返回数组 answer 。
#
#
#
# 示例 1：
#
# 输入：nums = [10,4,8,3]
# 输出：[15,1,11,22]
# 解释：数组 leftSum 为 [0,10,14,22] 且数组 rightSum 为 [15,11,3,0] 。
# 数组 answer 为 [|0 - 15|,|10 - 11|,|14 - 3|,|22 - 0|] = [15,1,11,22] 。
#
#
# 示例 2：
#
# 输入：nums = [1]
# 输出：[0]
# 解释：数组 leftSum 为 [0] 且数组 rightSum 为 [0] 。
# 数组 answer 为 [|0 - 0|] = [0] 。
#
#
#
#
# 提示：
#
#
# 1 <= nums.length <= 1000
# 1 <= nums[i] <= 10^5
#
#
#

# @lc code=start


class Solution:
  def leftRigthDifference(self, nums: List[int]) -> List[int]:
    left_sum, right_sum = 0, sum(nums)
    for i, x in enumerate(nums):
      right_sum -= x
      nums[i] = abs(left_sum - right_sum)
      left_sum += x
    return nums
    # @lc code=end
