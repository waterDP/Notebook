import {createStore} from "redux"
let initState  = 0
const INCREMENT = Symbol.for('INCREMENT')
const DECREMENT = Symbol.for('DECREMENT')
/**
 * 在reduce动作是有规定的，规定必须有一个不为undefined的 type属性，用来表示动作类型 
 * @param {*} state
 * @param {*} action
 */ 
function reducer(state, action) {
  switch(action.type) {
    case INCREMENT: 
      return state + 1 // 返回一个加1的新状态
    case DECREMENT: 
      return state - 1  
    default:  
      return state
  }
}

let store = createStore(reducer, initState)

function render(){
  counterValue.innerHTML = store.getState();
}
render()
store.subscribe(render)

incrementBtn.addEventListener('click', function() {
  store.dispatch({type: INCREMENT})
})
decrementBtn.addEventListener('click', function() {
  store.dispatch({type: DECREMENT})
})
