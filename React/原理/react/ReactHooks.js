let hookStates = []
let hookIndex = 0

// todo mock 实际上是一个调试函数来完成的组件树的更新
function render() {
  hookIndex = 0
  ReactDom.render(
    <App />,
    document.getElementById('root')
  )
}

export function memo(OldComponent) {
  return class extends React.PureComponent {
    render() {
      return <OldComponent {...this.props}/>
    }
  }
}

export function useState(initialState) {
  hookStates[hookIndex] = hookStates[hookIndex] || initialState
  let currentIndex = hookIndex
  function setState(newState) {
    hookStates[currentIndex] = 
      (typeof newState === 'function' ? newState(hookStates[currentIndex]) : newState)
    render()
  }
  
  return [
    hookStates[hookIndex++],
    setState
  ]
}

export function useMemo(factory, deps) {
  if (hookStates[hookIndex]) {
    let [lastMemo, lastDeps] = hookStates[hookIndex]
    let same = deps.every((item, index) => item === lastDeps[index])
    if (same) {
      hookIndex++ 
      return lastMemo
    }
  } 

  // 如果取不到，说明是第一次调用
  let newMemo = factory()
  hookState[hookIndex++] = [newMemo, deps]
  return newMemo
}

export function useCallback(callback, deps) {
  if (hookStates[hookIndex]) {
    let [lastCallback, lastDeps] = hookStates[hookIndex]
    let same = deps.every((item, index) => item === lastDeps[index])
    if (same) {
      hookIndex++ 
      return lastCallback
    }
  } 
 
  // 如果取不到，说明是第一次调用
  hookStates[hookIndex++] = [callback, deps]
  return callback
}

export function useReducer(reducer, initialState, init) {
  if (!hookStates[hookIndex]) {
    hookStates[hookIndex] = init ? init(initialState) : initialState
  }
  let currentIndex = hookIndex
  function dispatch(action) {
    hookStates[hookIndex] = reducer(hookStates[currentIndex], action)
    render()
  }
  return [
    hookStates[hookIndex++],
    dispatch
  ]
}