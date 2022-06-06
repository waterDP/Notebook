'''
Author: water.li
Date: 2022-06-06 21:20:37
LastEditors: water.li
LastEditTime: 2022-06-06 21:31:33
FilePath: \note\LeetCode\978.最长湍流子数组.py
'''
#
# @lc app=leetcode.cn id=978 lang=python3
#
# [978] 最长湍流子数组
#

# @lc code=start


class Solution:
  def maxTurbulenceSize(self, arr: List[int]) -> int:
    n = len(arr)
    left = right = 0
    ret = 1
    
    while right < n - 1:
      if left == right:
        if (arr[left] == arr[left+1]):
          left += 1
        right += 1
      else:
        if arr[right-1] > arr[right] and arr[right] < arr[right+1]:
          right += 1
        elif arr[right-1] < arr[right] and arr[right] > arr[right+1]:
          right += 1
        else:
          left = right
      ret = max(ret, right-left + 1)
      
    return ret
# @lc code=end
