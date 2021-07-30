/*
 * @Description: 面试算法题 栈的应用
 * @Date: 2021-07-30 17:00:23
 * @Author: water.li
 */
/*
  编写“智能重复”smartRepeat函数，实现：
  将 3[abc] 变为abcabcabc
  将 3[2[a]2[b]] 变为 aabbaabbaabb
  将 2[1[a]3[b]2[3[c]4[d]]] 变为abbbcccddddcccddddabbbcccddddcccdddd
  不用考虑输入字符串是非法的情况，比如：
  2[a3[b]]是错误的，应该补一个1，即2[1[a]3[b]]
  [abc]是错误的，应该补一个1，即1[abc]
*/
function smartRepeat(tempStr) {
  let p = 0
  const stack1 = [], stack2 = []
  while (p < tempStr.length - 1) {  
    const rest = tempStr.slice(p)
    if (/^\d+\[/.test(rest)) {
      let times = Number(rest.match(/^(\d+)\[/)[1])
      p += times.toString().length + 1
      stack1.push(times)
      stack2.push('')
    } else if (/^\w+\]/.test(rest)) {
      let word = rest.match(/^(\w+)\]/)[1]
      stack2[stack2.length - 1] = word
      p += word.length
    } else if (rest[0] === ']') {
      let times = stack1.pop()
      let word = stack2.pop()
      stack2[stack2.length-1] += word.repeat(times)
      p++
    }
  }
  return stack2[0].repeat(stack1[0])
}