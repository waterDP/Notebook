/*
 * @Description: 
 * @Date: 2021-09-29 15:27:05
 * @Author: water.li
 */
const init = {
  number: 0
}

export default (state = init, action) => {
  switch(action.type) {
    case 'addCount':
      return {...state, number: action.count+1}
    case 'reduceCount':
      return {...state, number: action.count-1}
    default:
      return state
  }
}
