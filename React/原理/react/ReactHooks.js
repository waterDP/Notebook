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
    // 如果是一个函数的话，就让它执行，传入老的状态返回一个新的状态
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

export function useContext(context) {
  return context._currentValue
}

export function useEffect(callback, deps) {
  if (hookStates[hookIndex]) {
    let {destroy, lastDeps} = hookStates[hookIndex]
    let same = deps.every((item, index) => item === lastDeps[index])
    if (same) { // 本次的依赖数组和上次的依赖数组一样
      hookIndex++
    } else {
      destroy && destroy()
      let state = {lastDeps: deps}
      hookStates[hookIndex++] = state
      setTimeout(() => {
        let destroy = callback
        state.destroy = destroy
      })
    }
  } else {
    let state = {lastDeps: deps}
    hookStates[hookIndex++] = state
    setTimeout(() => {
      let destroy = callback()
      state.destroy = destroy
    })
  }
}

export function useRef(current) {
  hookStates[hookIndex] = hookStates[hookStates] || {current}
  return hookStates[hookIndex++]
}