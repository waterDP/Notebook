#
# @lc app=leetcode.cn id=769 lang=python3
#
# [769] 最多能完成排序的块
#

# @lc code=start
class Solution:
  def maxChunksToSorted(self, arr: List[int]) -> int:
    ans = ma = 0
    for i, x in enumerate(arr):
      ma = max(ma, x)
      if ma == i: ans += 1
    return ans   
# @lc code=end

 