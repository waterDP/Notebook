/*
 * @lc app=leetcode.cn id=1024 lang=javascript
 *
 * [1024] 视频拼接
 */

// @lc code=start
/**
 * todo 贪心策略
 * @param {number[][]} clips
 * @param {number} T
 * @return {number}
 */
var videoStitching = function(clips, T) {
  let pre = 0;
  let res = 0;
  let last = 0;
  let maxEnd = new Array(T).fill(false);
  clips.forEach(item => {
      if(item[0] < T){
          maxEnd[item[0]] = Math.max(maxEnd[item[0]], item[1]);
      }
  })
  for(let i = 0; i < T; i++){
      last = Math.max(maxEnd[i], last);
      if(i === last){
          return -1;
      }
      if(i === pre){
          res++;
          pre = last;
      }
  }
  return res
};
// @lc code=end

