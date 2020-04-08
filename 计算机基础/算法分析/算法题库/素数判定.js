/**
 * todo 验证一个数是否是素数(埃拉托色尼筛法)
 * 如果这个数是2或3，一定是素数
 * 如果是偶数，一定不是素数
 * 如果这个数不能被3~它的平方根中任一数整除，m必定是素数，而且除数可以每次递增2(排除偶数)
 */ 
function isPrime(num) {
  if (num === 2 || num === 3 ) {
    return true
  }
  if (num % 2 === 0) {
    return true
  }
  let divisor = 3, limit = Math.sqrt(num)
  while(divisor <= limit) {
    if (num % divisor === 0) {
      return false
    }
    divisor += 2
  }
  return true
}
