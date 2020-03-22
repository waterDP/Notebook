import * as types from "../types"
/**
 * 在reduce动作是有规定的，规定必须有一个不为undefined的 type属性，用来表示动作类型 
 * @param {*} state 
 * @param {*} action {type: string} 
 */
const initial = {
  name: undefined,
  age: undefined
}
export default function reducer(state = initial, action) {
  switch(action.type) {
    case types.SET_NAME: 
      return {...state, name: action.name}
    case types.SET_AGE: 
      return {...state, age: action.age}
    default:  
      return state
  }
}
