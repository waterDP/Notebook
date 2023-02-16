import React from 'react'
import ReactDOM from 'react-dom'
import {createStore} from 'redux'
import PropTypes from 'prop-types'
import {Provider, connect} from 'react-redux'

class Counter extends React.Component {
  render() {
    const {value, onIncreaseClick} = this.props
    return (
      <div>
        <span>{value}</span>
        <button onClick={onIncreaseClick}>+1</button>
      </div>
    )
  }
}

Counter.propTypes = {
  value: PropTypes.number.isRequired,
  onIncreaseClick: PropTypes.func.isRequired
}

// Action
const increaseAction = {type: 'increase'}

// Reducer 基于原有state根据action得到新的state
function counter(state={count: 0}, action) {
  const count = state.count
  switch(action.type) {
    case 'increase':
      return {count: count + 1}
    default: 
      return state
  }
}

// 根据reduce函数通过createStore()创建store
const store = createStore(counter)

const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(Counter)

function mapStateToProps(state) {
  return {
    value: state.count
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onIncreaseClick: () => dispatch(increaseAction)
  }
}

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>
)