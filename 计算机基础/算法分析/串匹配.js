// ! KMP
function kmpSearch(s, p) {
  let i = 0, j = 0, sLen = s.length, pLen = p.length
  while (i < sLen && j < pLen) {
    // 如果j=-1，或者当前字符匹配成功（即s[i] === p[j]）, 者令i++, j++
    if (j === -1 || s[i] === p[j]) {
      i++
      j++
    } else {
      j = next[j]
    }
  }
  if (j === pLen) {
    return i - j
  }
  return -1
}