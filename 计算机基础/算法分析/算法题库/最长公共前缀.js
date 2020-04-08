// todo 编写一个函数来查找字符串数组中的最长公共前缀，如果不存在公共前缀，返回空字符串""
/* 
  示例1
  输入：['flower', 'flow', 'flight']
  输出：'fl'

  示例2 
  输入：['dog', 'racecar', 'car']
  输出：''
*/

/**
 * @param {Array} arr
 * @return {String}
 */
function longestCommonPrefix(arr) {
  if (arr.length === 0) {
    return ''
  } else if (arr.length === 1) {
    return arr[0]
  }

  let res = '', temp = ''
  for (let i=0; i < arr[0].length; i++) { // 以数组第一个元素为标准
    res += arr[0][i]
    for (let j = 1; j < arr.length; j++) { // 如果后面所有元素都是以前缀开头，则前缀++
      if (arr[j].indexOf(res) !== 0) {
        return temp  // 否则返回temp
      }
    }
    temp = res
  }
  return res
}

console.log(longestCommonPrefix(['flower', 'flow', 'flight']))