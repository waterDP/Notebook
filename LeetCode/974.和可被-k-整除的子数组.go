/*
 * @Author: water.li
 * @Date: 2022-06-06 22:45:31
 * @LastEditors: water.li
 * @LastEditTime: 2022-06-06 22:51:10
 * @FilePath: \note\LeetCode\974.和可被-k-整除的子数组.go
 */
/*
 * @lc app=leetcode.cn id=974 lang=golang
 *
 * [974] 和可被 K 整除的子数组
 */

// @lc code=start
func subarraysDivByK(nums []int, k int) int {
	record := map[int]int{0: 1}
	sum, ans := 0, 0
	for _, elem := range nums {
		sum += elem
		mod := (sum%k + k) % k
		record[mod]++
	}
	for _, cx := range record {
		ans += cx * (cx - 1) / 2
	}
	return ans
}

// @lc code=end

