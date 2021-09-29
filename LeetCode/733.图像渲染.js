/*
 * @lc app=leetcode.cn id=733 lang=javascript
 *
 * [733] 图像渲染
 */

// @lc code=start
/**
 * @param {number[][]} image
 * @param {number} sr
 * @param {number} sc
 * @param {number} newColor
 * @return {number[][]}
 */
var floodFill = function(image, sr, sc, newColor) {
  if (image[sr][sc] === newColor) return image
  const target = image[sr][sc]
  const rows = image.length
  const cols = image[0].length
  const dfs = (r, c) => {
    if (r >= 0 && r < rows && c >= 0 && c < cols && image[r][c] === target) {
      image[r][c] = newColor
      dfs(r+1, c)
      dfs(r-1, c)
      dfs(r, c+1)
      dfs(r, c-1)
    }
  }
  dfs(sr, sc)
  return image
};
// @lc code=end

