/*
 * @Description: 
 * @Date: 2021-09-29 15:03:21
 * @Author: water.li
 */

import { applyMiddleware, compose, createStore } from "redux";
import thunk from 'redux-thunk'
import reducer from './reducer'

const store = createStore(reducer, compose(
  applyMiddleware(thunk)
))

export default store