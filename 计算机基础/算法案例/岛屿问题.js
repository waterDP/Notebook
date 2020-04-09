// todo 岛屿问题
/**
 * 一个矩阵中只有0和1两种值，每个位置都可以和自己的上、下、左、右四个位置相连，如果有一片1连在一起，这个部分叫做一个岛
 * 求一个矩阵中有多小个岛
 * 举例：下面这个矩阵有4个岛屿
 * let arrIsland = [
 *  [0,0,1,0,1,0]
 *  [1,1,1,0,1,0]
 *  [1,0,0,1,0,0]
 *  [0,0,0,0,0,1]
 * ]
 */
/* 
  实现思路：
  1.遍历整个矩阵，当a[i][j] === 1时，将其值改成2，同时岛屿的数量+1
  2.将这个位置的上下左右的四个位置的值都检查一遍，（递归实现）
   ·位置i,j超出边界或该位置的值不等于1，返回
   ·不是上面的情况，则：将该位置的值改为2，再重复步骤2
*/

function islandCount(arr) {
  if (!arr || arr.length === 0) {
    return
  }
  let N = arr.length, M = arr[0].length, res = 0
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < M; j++) {
      if (arr[i][j] === 1) {
        ++res
        infect(i, j)
      }
    }
  }
  return res

  function infect(i, j) {
    if (i < 0 || j < 0 || i >= N || j >= M || arr[i][j] !== 1) {
      return 
    }
    arr[i][j] = 2
    infect(i, j - 1)
    infect(i+1, j)
    infect(i, j+1)
    infect(i-1, j)
  }
}

let arrIsland = [
  [0,0,1,0,1,0],
  [1,1,1,0,1,0],
  [1,0,0,1,0,0],
  [0,0,0,0,0,1]
]
console.log(islandCount(arrIsland))