'''
Author: water.li
Date: 2022-05-16 20:11:56
Description: 
FilePath: \note\LeetCode\128.最长连续序列.py
'''
#
# @lc app=leetcode.cn id=128 lang=python3
#
# [128] 最长连续序列
#

# @lc code=start
class Solution:
  def longestConsecutive(self, nums: List[int]) -> int:
    longest_streak = 0
    num_set = set(nums)

    for num in num_set:
      if num - 1 not in num_set:
        current_num = num
        current_streak = 1

        while current_num + 1 in num_set:
          current_num += 1
          current_streak += 1

        longest_streak = max(longest_streak, current_streak)

    return longest_streak
    
# @lc code=end
