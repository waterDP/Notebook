
/**
 * 大数相加
 * @param {string} a
 * @param {string} b 
 * @return {string}
 */
function sum(a, b) {
  let ret = ''
  let carry = 0
  let max = Math.max(a.length, b.length)
  a = a.padStart(max, '0')
  b = b.padStart(max, '0')
  for (let i = max - 1; i >= 0; i--) {
    let sum = +a[i] + +b[i] + carry
    ret = sum % 10 + ret
    carry = sum >= 10 ? 1 : 0
  }
  return carry ? carry + ret : ret;
}