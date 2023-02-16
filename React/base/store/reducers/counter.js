import * as types from "../types"
/**
 * 在reduce动作是有规定的，规定必须有一个不为undefined的 type属性，用来表示动作类型 
 * @param {*} state 
 * @param {*} action {type: string} 
 */ 
const initial = 0
export default function reducer(state = initial, action) {
  switch(action.type) {
    case types.INCREMENT: 
      return state + 1 // 返回一个加1的新状态
    case types.DECREMENT: 
      return state - 1  
    default:  
      return state
  }
}
