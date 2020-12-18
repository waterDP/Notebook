import React from 'react';
import dva, { connect } from 'dva';
import keymaster from 'keymaster';
import { Router, Route } from 'dva/router';
//dva react react-dom redux redux-saga react-router react-router-dom history 
const app = dva();
//redux combineReducers reducer都有自己的状态 
//combineReducers({counter:counterReducer})
//总的状态树 state={counter:0,counter2:0}
const delay = (millseconds) => {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve();
    }, millseconds);
  });
}
app.model({
  namespace: 'counter',
  state: { number: 0 },
  reducers: {//接收老状态，返回新状态
    add(state) { //dispatch({type:'add'});
      return { number: state.number + 1 };
    },
    minus(state) {//dispatch({type:'minus'})
      return { number: state.number - 1 };
    }
  },
  // 延时操作 调用接口  等待
  effects: {
    *asyncAdd(action, { put, call }) { //redux-saga/effects {put,call}
      yield call(delay, 1000);//把100传给delay并调用，yield会等待promise完成
      yield put({ type: 'add' });
    }
  },
  subscriptions: {
    keyboard({ dispatch }) {
      keymaster('space', () => {
        dispatch({ type: 'add' });
      });
    },
    changeTitle({ history }) {
      setTimeout(function () {
        history.listen(({ pathname }) => {
          document.title = pathname;
        });
      }, 1000);

    }
  }
});
app.model({
  namespace: 'counter2',
  state: { number: 0 },
  reducers: {//接收老状态，返回新状态
    add(state) { //dispatch({type:'add'});
      return { number: state.number + 1 };
    },
    minus(state) {//dispatch({type:'minus'})
      return { number: state.number - 1 };
    }
  }
});
const Counter = (props) => {
  return (
    <div>
      <p>{props.number}</p>
      <button onClick={() => props.dispatch({ type: 'counter/add' })}>add</button>
      <button onClick={() => props.dispatch({ type: 'counter/asyncAdd' })}>asyncAdd</button>
      <button onClick={() => props.dispatch({ type: 'counter/minus' })}>-</button>
    </div>
  )
}
const Counter2 = (props) => {
  return (
    <div>
      <p>{props.number}</p>
      <button onClick={() => props.dispatch({ type: 'counter2/add' })}>+</button>
      <button onClick={() => props.dispatch({ type: 'counter2/minus' })}>-</button>
    </div>
  )
}
//{counter1:{number:0},counter2:{number:0}}
const ConnectedCounter = connect(
  state => state.counter
)(Counter);
const ConnectedCounter2 = connect(
  state => state.counter2
)(Counter2)

app.router(
  ({ app, history }) => (
    <Router history={history}>
      <>
        <Route path="/counter1" component={ConnectedCounter} />
        <Route path="/counter2" component={ConnectedCounter2} />
      </>
    </Router>
  )
)

app.start('#root')