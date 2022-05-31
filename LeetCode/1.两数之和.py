'''
Author: li.haoran li.haoran@99cloud.net
Date: 2022-05-31 18:59:42
LastEditors: li.haoran li.haoran@99cloud.net
LastEditTime: 2022-05-31 19:15:29
'''
#
# @lc app=leetcode.cn id=1 lang=python3
#
# [1] 两数之和
#

# @lc code=start
class Solution:
  def twoSum(self, nums, target: int):
    hashtable = dict()
    for i, num in enumerate(nums):
      if target - num in hashtable:
        return [hashtable[target - num], i]
      hashtable[nums[i]] = i
    return []

    # @lc code=end
