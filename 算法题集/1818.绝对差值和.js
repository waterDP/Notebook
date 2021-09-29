/*
 * @lc app=leetcode.cn id=1818 lang=javascript
 *
 * [1818] 绝对差值和
 */

// @lc code=start
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var minAbsoluteSumDiff = function(nums1, nums2) {
  const MOD = 1000000007
  const n = nums1.length
  const rec = [...nums1]
  rec.sort((a, b) => a - b)
  let sum = 0, maxn = 0
  for (let i = 0; i < n; i++) {
    const diff = Math.abs(nums1[i] - nums2[i])
    sum = (sum + diff) % MOD
    const j = binarySearch(rec, nums2[i])
    if (j < n) {
      maxn = Math.max(maxn, diff - (rec[j] - nums2[i]))
    }
    if (j > 0) {
      maxn = Math.max(maxn, diff - (nums2[i] - rec[j - 1]))
    }
  }
  return (sum - maxn + MOD) % MOD
};

function binarySearch(rec, target) {
  let low = 0, high = rec.length - 1
  if (rec[high] < target) {
    return high + 1
  }
  while (low < high) {
    const mid = Math.floor((high - low) / 2) + low
    if (rec[mid] < target) {
      low = mid + 1
    } else {
      high = mid
    }
  }
  return low
}
// @lc code=end

