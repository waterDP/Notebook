// todo: 斐波拉契数列
// 最简单的做法：递归
function fibonacci(n) {
  if (n < 0) {
    return 0
  } 
  if (n === 0) {
    return 1
  }
  return fibonacci(n-1) + fibonacci(n-2)
}
/* 
  但是递归会有严重的效率问题。比如相要示得f(10)，首先需求f(9)和f(8)。
  同样，想求f(9),首先要求f(8),f(7)这样就有很多重复值，计算量也很大、

  改进；从下往上计算，首先根据f(0)和f(1)计算出f(2)，再根据f(1)和f(2)计算出f(3)... 以此类推就可以计算出第n项。时间复杂度O(n)
*/
function fibonacci(n) {
  let ori = [0, 1]
  if (n < 2) {
    return ori[n]
  } 
  let fibOne = 1, fibTwo = 0, fibSum = 0
  for (let i = 2; i < n; i++) {
    fibSum = fibOne + fibTwo
    fibTwo = fibOne
    fibOne = fibSum
  }
  return fibSum
}

