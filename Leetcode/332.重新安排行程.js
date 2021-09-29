/*
 * @lc app=leetcode.cn id=332 lang=javascript
 *
 * [332] 重新安排行程
 */

// @lc code=start
/**
 * todo Hierholzer算法
 * @param {string[][]} tickets
 * @return {string[]}
 */
var findItinerary = function(tickets) {
  const result = [], map = {}
  for (const ticket of tickets) {
    const [from, to] = ticket
    map[from] ? map[from].push(to) : (map[from] = [to])
  }
  for (let city in map) {
    map[city].sort()
  }

  const recursion = node => {
    const nextNodes = map[node]
    while (nextNodes && nextNodes.length) {
      const next = nextNodes.shift()
      recursion(next)
    }
    // 如果当前城市没有下一站，就将它添加到result中
    // 然后递归结束，向上返回，选过的城市一个个推入到result中
    result.unshift(node)
  }

  recursion('JFK')
  return result
};
// @lc code=end

