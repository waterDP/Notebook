/*
 * @lc app=leetcode.cn id=771 lang=rust
 *
 * [771] 宝石与石头
 */

// @lc code=start
use std::collections::HashMap;

impl Solution {
  pub fn num_jewels_in_stones(jewels: String, stones: String) -> i32 {
    let mut count = 0;
    let mut map = HashMap::new();
    for item in jewels.chars() {
      map.insert(item, 0);
    }
    for charS in stones.chars() {
      match map.get(&charS) {
        Some(_) => count+=1,
        None => {},
      }
    }
    return count;
  }
}
// @lc code=end

