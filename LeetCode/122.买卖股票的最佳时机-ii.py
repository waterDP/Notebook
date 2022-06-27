'''
Author: water.li
Date: 2022-06-27 23:00:11
LastEditors: water.li
LastEditTime: 2022-06-27 23:10:10
FilePath: \note\LeetCode\122.买卖股票的最佳时机-ii.py
'''
#
# @lc app=leetcode.cn id=122 lang=python3
#
# [122] 买卖股票的最佳时机 II
#

# @lc code=start
class Solution:
  def maxProfit(self, prices: List[int]) -> int:
    ret = 0
    l = len(prices)
    for i in range(1, l):
      ret += max(0, prices[i] -prices[i - 1])
    return ret
# @lc code=end

