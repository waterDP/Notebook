// todo DFS 深度优先搜索算法

/** 
 * todo 字符串全排序
 * @input 'abc'
 * @return ['abc', 'acb', 'bac', ...] 
 */
function fullPermutation(str) {
  let p = str.split('')
  let pb = new Array(str.length).fill(false)
  const result = []
  const dfs = function(p, res) {
    if (res.length === p.length) {
      result.push([...res])
      return
    }
    for (let i = 0; i<p.length; i++) {
      let item = p[i]
      if (item) {
        res.push(item)
        p[i] = null
        dfs(p, res)
        res.pop()
        p[i] = item
      }
    }
  }
  dfs(p, [])
  return result
}

console.log(fullPermutation('abc'))

