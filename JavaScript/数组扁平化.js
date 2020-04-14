// todo 递归实现 
function flat (arr) {
  let result = []
  arr.forEach(value => {
    if (value instanceof Array) {
      result = result.concat(flat(value)) 
    } else {
      result.push(value)
    }
  })
  return result
}

// todo reduce实现
function flat(arr) {
  return arr.reduce((prev, curr) => {
    return prev.concat(Array.isArray(curr) ? flat(curr) : cur)
  }, [])
}

// todo flat 参数为层数（默认一层）
arr.flat(Infinity)

// todo 扩展运算符
function flat(arr) {
  while(arr.some(Array.isArray)){
    arr = [].concat(...arr)
  }
  return arr
}
