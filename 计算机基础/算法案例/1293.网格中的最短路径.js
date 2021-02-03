/*
 * @lc app=leetcode.cn id=1293 lang=javascript
 *
 * [1293] 网格中的最短路径
 */

// @lc code=start
/**
 * @param {number[][]} grid
 * @param {number} k
 * @return {number}
 */
var shortestPath = function(grid, K) {
  const xlen = grid.length
  const ylen = grid[0].length
  // vis 3维数组，记录到i，j位置消除k个障碍的最短距离
  const vis = []

  for (let i = 0; i < xlen; i++) {
    vis[i] = []
    for (let j = 0; j < ylen; j++) {
      vis[i][j] = []
      for (let k = 0; k <= K; k++) {
        // 初始化为最大安全整数
        vis[i][j][k] = Number.MAX_SAFE_INTEGER
      }
    }
  }
  // 记录答案
  let ans = Number.MAX_SAFE_INTEGER
  function dfs(i, j, k, l) {
    // 抵达n，m
    if (i === xlen - 1 && j === ylen - 1) {
      // 消除的障碍物<=规定的K 同时取走得距离短的
      if (k <= K && ans > l) {
        ans = l
      }
      return
    }
    // 如果消除的障碍物多余K 或者当前走得距离比已得的最短路长则舍弃
    if (k > K || l > ans) {
      return
    }
    // 向4个方向深搜
    if (i + 1 < xlen) {
      if (grid[i + 1][j]) {
        // 重点剪枝条件 若 vis[i+1][j][k+1]比已知到达该点的距离长，则舍弃这条路 下同
        if (vis[i + 1][j][k + 1] > l) {
          vis[i + 1][j][k + 1] = l
          dfs(i + 1, j, k + 1, l + 1)
        }
        // 重点剪枝条件 若 vis[i+1][j][k]比已知到达该点的距离长，则舍弃这条路 下同
      } else if (vis[i + 1][j][k] > l) {
        vis[i + 1][j][k] = l
        dfs(i + 1, j, k, l + 1)
      }
    }
    if (i - 1 >= 0) {
      if (grid[i - 1][j]) {
        if (vis[i - 1][j][k + 1] > l) {
          vis[i - 1][j][k + 1] = l
          dfs(i - 1, j, k + 1, l + 1)
        }
      } else if (vis[i - 1][j][k] > l) {
        vis[i - 1][j][k] = l
        dfs(i - 1, j, k, l + 1)
      }
    }
    if (j + 1 < ylen) {
      if (grid[i][j + 1]) {
        if (vis[i][j + 1][k + 1] > l) {
          vis[i][j + 1][k + 1] = l
          dfs(i, j + 1, k + 1, l + 1)
        }
      } else if (vis[i][j + 1][k] > l) {
        vis[i][j + 1][k] = l
        dfs(i, j + 1, k, l + 1)
      }
    }
    if (j - 1 >= 0) {
      if (grid[i][j - 1]) {
        if (vis[i][j - 1][k + 1] > l) {
          vis[i][j - 1][k + 1] = l
          dfs(i, j - 1, k + 1, l + 1)
        }
      } else if (vis[i][j - 1][k] > l) {
        vis[i][j - 1][k] = l
        dfs(i, j - 1, k, l + 1)
      }
    }
  }
  dfs(0, 0, 0, 0)
  return ans === Number.MAX_SAFE_INTEGER ? -1 : ans
};
// @lc code=end

