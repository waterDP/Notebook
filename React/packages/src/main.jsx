/*
 * @Author: water.li
 * @Date: 2023-02-25 21:58:15
 * @Description: 
 * @FilePath: \Notebook\React\packages\src\main.jsx
 */
import * as React from "react"
import { createRoot } from "react-dom/client"

function reducer(state, action) {
  if (action.type === 'add') return state + action.payload
  return state
}

function FunctionComponent() {
  const [number, dispatch] = React.useReducer(reducer, 0)
  return <button onClick={() => dispatch({type: 'add', payload: 1})}>{number}</button>
}

let element = <FunctionComponent />

console.log(element)

const root = createRoot(document.getElementById('root'))
// 把element虚拟DOM渲染到容器中
root.render(element)