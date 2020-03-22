import {createStore, applyMiddleware} from "redux";
import reducers from "./reducers"
// let store = createStore(reducers);
let store = applyMiddleware(logger/* 中单件 */)(createStore)(reducers)
export default store;