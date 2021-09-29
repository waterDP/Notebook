/*
 * @lc app=leetcode.cn id=278 lang=javascript
 *
 * [278] 第一个错误的版本
 */

// @lc code=start
/**
 * Definition for isBadVersion()
 * 
 * @param {integer} version number
 * @return {boolean} whether the version is bad
 * isBadVersion = function(version) {
 *     ...
 * };
 */

/**
 * @param {function} isBadVersion()
 * @return {function}
 */
var solution = function (isBadVersion) {
	/**
	 * @param {integer} n Total versions
	 * @return {integer} The first bad version
	 */
	return function (n) {
		let left = 1, right = n
		while (left < right) {
			let mid = Math.floor(left + (right - left) / 2)
			if (isBadVersion(mid)) {
			  right = mid
			} else {
				left = mid + 1 
			}
		}
		return left
	};
};
// @lc code=end

