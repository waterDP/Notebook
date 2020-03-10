import * as types from "./types"
/**
 * 在reduce动作是有规定的，规定必须有一个不为undefined的 type属性，用来表示动作类型 
 * @param {*} state {type: string}
 * @param {*} action
 */ 
export default function reducer(state, action) {
  switch(action.type) {
    case types.INCREMENT: 
      return state + 1 // 返回一个加1的新状态
    case types.DECREMENT: 
      return state - 1  
    default:  
      return state
  }
}
