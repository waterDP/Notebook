/*
 * @lc app=leetcode.cn id=207 lang=javascript
 *
 * [207] 课程表
 */

// @lc code=start
/**
 * todo kahn算法(卡恩算法)
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {boolean}
 */
var canFinish = function(numCourses, prerequisites) {
  if (prerequisites.length === 0) {
    return true
  }

  let inDegree = new Array(numCourses).fill(0)
  let map = new Map() // 维护临接表

  for (let e of prerequisites) {
    inDegree[e[0]]++
    if (!map.has(e[1])) map.set(e[1], [])
    let vEdge = map.get(e[1])
    vEdge.push(e[0])
  }
  
  let queue = []
  // 首先加入入度为0的结点
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) {
      queue.push(i)
    }
  }

  while(queue.length > 0) {
    let v = queue.shift()
    numCourses--
    if (!map.has(v)) continue
    for (let w of map.get(v)) {
      inDegree[w]--
      if (inDegree[w] === 0) {
        queue.push(w)
      }
    }
  }

  return numCourses === 0
};
// @lc code=end

