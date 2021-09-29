/*
 * @lc app=leetcode.cn id=433 lang=javascript
 *
 * [433] 最小基因变化
 */

// @lc code=start
/**
 * @param {string} start
 * @param {string} end
 * @param {string[]} bank
 * @return {number}
 */
var minMutation = function(start, end, bank) {
  const bankSet = new Set(bank)
  if (!bankSet.has(end)) return -1
  const queue = [[start, 0]]
  const dna = ['A', 'C', 'G', 'T']
  while (queue.length) {
    const [node, count] = queue.shift()
    if (node === end) return count
    for (let i = 0; i < node.length; i++) {
      for (let j = 0; j < dna.length; j++) {
        // 模拟突变
        let d = node.slice(0, i) + dna[j] + node.slice(i+1)  
        if (bankSet.has(d)) {
          queue.push([d, count+1])
          // 剪枝，避免重复
          bankSet.delete(d)
        }
      }
    }
  }
  return -1
};
// @lc code=end

