import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import { createStore, applyMiddleware, bindActionCreators } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { put, takeEvery, delay, all } from 'redux-saga/effects'

function* helloSaga() {
  yield console.log('hello Saga')
}

function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':   
      return state - 1
    default:
      return state
  }
}

// !sagaMiddleware
const sagaMiddleware = createSagaMiddleware()

// ! store
const store = createStore(
  reducer, 1,
  applyMiddleware(sagaMiddleware)
)

sagaMiddleware.run(rootSaga)

class Counter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: props.store.getState()
    }
  }

  componentDidMount() {
    this.unsubscribe = this.props.store.subscribe(() => {
      this.setState({value: this.props.store.getState()})
    })
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    const {onIncrement, onDecrement, onIncrementAsync } = this.props
    debugger
    return (
      <div>
        <button onClick={onIncrementAsync}>
          Increment after 1 second
    </button>
        {' '}
        <button onClick={onIncrement}>
          Increment
    </button>
        {' '}
        <button onClick={onDecrement}>
          Decrement
    </button>
        <hr />
        <div>
          Clicked: {this.state.value} times
    </div>
      </div>
    )
  }
}

// ! worker
function* incrementAsyncG() {
  yield delay(1000)
  yield put({ type: 'INCREMENT' })
}

// ! watcher
function* watchIncrementAsync() {
  yield takeEvery('INCREMENT_ASYNC', incrementAsyncG)
}

// !root
function* rootSaga() {
  yield all([
    helloSaga(),
    watchIncrementAsync()
  ])
}

window.store = store


const actions = {
  increment() {
    return {type: 'INCREMENT'}
  },
  decrement() {
    debugger
    return {type: 'DECREMENT'}
  },
  incrementAsync() {
    debugger
    return {type: 'INCREMENT_ASYNC'}
  }
}

const {
  increment,
  decrement,
  incrementAsync
} = bindActionCreators(actions, store.dispatch)

ReactDOM.render(
  <Counter
    store={store}
    onIncrement={increment}
    onDecrement={decrement}
    onIncrementAsync={incrementAsync}
  />,
  document.getElementById('root')
)