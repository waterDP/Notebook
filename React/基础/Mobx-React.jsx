import React from 'react'
import ReactDOM from 'react-dom'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'

// create state object
let appState = observable({timer: 0})

// define action 
setInterval(
  action(() => {
    appState.timer += 1
  }),
  1000
)

appState.resetTimer = action(()=>{
  appState.timer = 0
})

// create abserver
let App = observer(({appState}) => {
  return (
    <div className="App">
      <h1>Time passed: {appState.timer}</h1>
      <button onClick={appState.resetTimer}>reset timer</button>
    </div>
  )
})

const root = document.getElementById('root')
ReactDOM.render(<App appState={appState} />, root)