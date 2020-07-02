const filters = {
  /** 
   * 首字母大写 
   */
  capitalize(value) {
    if (!value) return ''
    value = value.toString()
    return `${value.charAt(0).toUpperCase()}${value.slice(1)}`
  },
  /**
   * 格式化百分数
   * @param {number} num
   */
  formatPercent(num) {
    let val = Math.abs(num) || 0
    return (val * 100).toFixed(2) + '%'
  }
}

const install = Vue => {
  Object.keys(filters).forEach(filter => {
    Vue.filter(filter, filters[filter])
  })
}

export default install