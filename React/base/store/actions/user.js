import * as types from "../types"
export default {
  increment(name) {
    return {type: types.SET_NAME, name}
  },
  decrement(age) {
    return {type: types.SET_AGE, age}
  }
}
 