/*
 * @lc app=leetcode.cn id=478 lang=javascript
 *
 * [478] 在圆内随机生成点
 */

// @lc code=start
/**
 * @param {number} radius
 * @param {number} x_center
 * @param {number} y_center
 */
var Solution = function(radius, x_center, y_center) {
  this.center = [x_center, y_center]
  this.radius = radius
};

/**
 * @return {number[]}
 */
Solution.prototype.randPoint = function() {
  const xLeft = this.center[0] - this.radius
  const yBottom = this.center[1] - this.radius
  let x = xLeft + Math.random() * 2 * this.radius
  let y = yBottom + Math.random() * 2 * this.radius
  while(true) {
    let distance = 
      Math.sqrt(Math.pow(x - this.center[0], 2) + Math.pow(y - this.center[1], 2))
    if (distance > this.radius) {
      x = xLeft + Math.random() * 2 * this.radius
      y = yBottom + Math.random() * 2 * this.radius
    } else {
      return [x, y]
    }
  }
};

/**
 * Your Solution object will be instantiated and called as such:
 * var obj = new Solution(radius, x_center, y_center)
 * var param_1 = obj.randPoint()
 */
// @lc code=end

