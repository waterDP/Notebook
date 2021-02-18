// ! KMP
function kmpSearch(s, p) {
  let i = 0, j = 0, sLen = s.length, pLen = p.length
  let next = getNext(p)
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
function getNext(p) {
  let pLen = p.length
  let k = -1, j = 0
  const res = [-1]
  while(j < pLen - 1) {
    // p[k] 表示前缀 p[j]表示后缀
    if (k == -1||p[j] === p[k]) {
      ++k
      ++j
      res[j] = k
    } else  {
      k = res[k]
    }
  }
  return res
}

console.log(kmpSearch('aababaabf', 'abf'))