import React from 'react';
import ReactDOM from 'react-dom';
import * as actions from './store/action'
import { useSelector, useDispatch } from 'react-redux';
import { Provider } from 'react-redux';
import store from './store/index';
import {bindActionCreators} from "redux"


const App = () => {
  const count = useSelector(state => state.count.number) // vuex mapState
  const dispatch = useDispatch()

  const {
    add,
    reduce
  } = bindActionCreators(actions, dispatch)

  return (
    <>
      <span>{count}</span>
      <button onClick={() => reduce(count)}>reduce</button>
      <button onClick={() => add(count)}>add</button>
    </>
  )
}

ReactDOM.render(
  <Provider store={store}>
    <App></App>
  </Provider>,
  document.getElementById('root')
)
