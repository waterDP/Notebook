import * as types from "./types"
export default {
  increment() {
    return {type: types.INCREMENT}
  },
  decrement() {
    return {type: types.DECREMENT}
  }
}
 