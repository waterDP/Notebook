// todo 简介
import React, {useState} from "react"


/**
 * useState 
 * useRef
 * useMemo
 * useCallback
 * useEffect 会在每次挂载之后和每次更新之后执行里面的函数
 * useReducer
 * useContext
 * useImperativeHandle
 * useLayoutEffect
 */

// todo State Hook
function Example() {
  // 声明一个新的叫做'count'的state变量
  // useState的参数可以是一个函数，此函数会在初次渲染的时候执行，而且只会执行一次
  const [count, setCount] = useState(0)
  return (
    <div>
      <p>You Clicked {count} times</p>
      <button onClick={() => setCount(count+1)}></button>
    </div>
  )
}


// todo Effect Hook
import React, {useState, useEffect} from "react"
function Example1() {
  const [count, setCount] = useState(0)
  // 相当于componentDidMount 和 componentDidUpdate
  useEffect(() => {
    // 使用浏览器的API更新页面标题
    document.title = `You clicked ${count} times`
    let timer = setInterval(() => {
      setCount(count => count + 1)
    })
    // 副作用函数可以通过返回一个函数来清除副作用
    // 清除函数会在组件卸载的时候执行，另外如果组件多次渲染，则在执行下一个effect之前执行上一个清除函数
    return function() {  // componentWillUnmount
      clearTimeout(timer)
    }
  })

  return (
    <>
      <div>You clicked {count} times</div>
      <button onClick={() => setCount(count+1)}>
        Click me
      </button>
    </>
  )
}

// todo 需要清除的effect
// class
class FriendStatus extends React.Component {
  constructor(props) {
    super(props)
    this.state = {isOnline: null}
  }
  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    )
  }
  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    )
  }
  handleStatusChange(status) {
    this.setState({
      inOnline: status.isOnline
    })
  }
  render() {
    if (this.state.isOnline === null) {
      return 'Loading...'
    }
    return this.state.isOnline ? 'Online' : 'Offline'
  }
}

// todo useRef
import {useRef} from 'react'
function TextInputWithFocusButton() {
  const inputEl = useRef(null)
  const onButtonClick = () => {
    // current 指向已经挂载到DOM上的文本输入元素
    inputEl.current.focus()
  }
  return (
    <>
      <input ref={inputEl} />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  )
}

useEffect(() => {}, []) // 空数组表示依赖项永远不变，所以回调函数只会执行一次

/**
 * @description: 
 * @param {function} reducer
 * @param {any} initialState 初始状态
 * @param {function} init 初始状态的方法
 * @return {*}
 */
const [state, dispatch] = useReducer(reducer, initialState, init)


// todo useReducer
const CounterContext = React.createContext()

function Counter() {
  let {state, dispatch} = React.useContext()
  return (
    <div>
      <p>number: {state.number}</p>
      <button onClick={()=>dispatch({type: 'ADD'})}>number+</button>
    </div>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState, init)
  const value = {state, dispatch}
  return (
    <CounterContext.Provider value={value}>
      <Counter />
    </CounterContext.Provider>
  )
}


/**
 * todo useMemo
 * useMemo 接受两个参数，条一个参数是一个函数，返回值用于生产保存值。
 * 第二个参数，作为dep依赖项，数组里面的依赖项发生变化，重新执行第一个函数，产生新的值
 */
// ! 缓存一些值，避免重新执行上下文
const number = useMemo(() => {
  return number
}, [props.number])  // 只有props.number改变的时候，重新计算number的值

// ! 减少不必要的dom循环
{
  useMemo(() => {
    <div>
      {
        selectList.map((item, value) => {
          <span
            className={styleMedia.listSpan}
            key={value}
          >
            {item.patentName}
          </span>
        })
      }
    </div>
  }, [selectList])
}

// ! 减少子组件渲染
const goodListChild = useMemo(() => {
  <GoodList list={props.list} />
}, [props.list])

