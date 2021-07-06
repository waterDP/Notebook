/*
 * @lc app=leetcode.cn id=1418 lang=javascript
 *
 * [1418] 点菜展示表
 */

// @lc code=start
/**
 * @param {string[][]} orders
 * @return {string[][]}
 */
var displayTable = function(orders) {
  // 从订单中获取餐品名称和桌号，统计每桌上点餐数量
  const nameSet = new Set()
  const foodsCnt = new Map()
  for (const order of orders) {
    nameSet.add(order[2])
    const id = parseInt(order[1])
    const map = foodsCnt.get(id) || new Map()
    map.set(order[2], (map.get(order[2])||0) + 1)
    foodsCnt.set(id, map)
  }

  // 提取餐品名称，并按字母顺序排列
  const n = nameSet.size 
  const names = []
  for (const name of nameSet) {
    names.push(name)
  }
  names.sort()

  // 提取桌号，并按餐桌号升序排列
  const m = foodsCnt.size
  const ids = []
  for (const id of foodsCnt.keys()) {
    ids.push(id)
  }
  ids.sort((a, b) => a - b)

  // 填写点菜展示表
  const table = []
  const header = []
  header.push('Table')
  for (const name of names) {
    header.push(name)
  }
  table.push(header)
  for (let i = 0; i < m; i++) {
    const id = ids[i]
    const cnt = foodsCnt.get(id)
    const row = []
    row.push(id.toString())
    for (let j = 0; j < n; ++j) {
      row.push((cnt.get(names[j]) || 0).toString())
    }
    table.push(row)
  }
  return table
};
// @lc code=end
