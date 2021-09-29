/*
 * @Description: 
 * @Date: 2021-09-29 15:11:59
 * @Author: water.li
 */
export const add = count => {
  return ({
    type: 'addCount',
    count
  })
}

export const reduce = count => {
  return ({
    type: 'reduceCount',
    count
  })
}