import counter from "./counter"
import user from "./user"
import {combineReducers} from "redux"

export default combineReducers({
  counter,
  user
})