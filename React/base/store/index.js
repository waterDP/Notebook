/*
 * @Author: water.li
 * @Date: 2021-01-04 22:47:00
 * @Description: 
 * @FilePath: \notebook\React\基础\store\index.js
 */
import {createStore, applyMiddleware} from "redux";
import reducers from "./reducers"
// let store = createStore(reducers);
let store = applyMiddleware(logger/* 中间件 */)(createStore)(reducers)
export default store