// todo: 计算最大公约数
function greatestCommonDivisor(a, b) {
  let divisor = 2, res = 1
  if (a < 2 || b < 2) {
    return 1
  }
  while(a >= divisor && b >= divisor) {
    if (a % divisor === 0 && b % divisor === 0) {
      res = divisor
    }
    divisor++
  }
  return res
}

// todo: 辗转相除法
function greatestCommonDivisor(a, b) {
  if (b === 0) {
    return a
  }

  return greatestCommonDivisor(b, a % b)
}
