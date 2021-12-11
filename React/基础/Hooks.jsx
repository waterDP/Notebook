// todo 简介
import React, { useState } from "react"


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

// todo useState
function Example() {
  // 声明一个新的叫做'count'的state变量
  // useState的参数可以是一个函数，此函数会在初次渲染的时候执行，而且只会执行一次
  const [count, setCount] = useState(0)
  return (
    <div>
      <p>You Clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}></button>
    </div>
  )
}


// todo useEffect
import React, { useState, useEffect } from "react"
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
    return function () {  // componentWillUnmount
      clearTimeout(timer)
    }
  })

  return (
    <>
      <div>You clicked {count} times</div>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </>
  )
}

useEffect(() => { }, []) //! 空数组表示依赖项永远不变，所以回调函数只会执行一次


// todo useRef
import { useRef } from 'react'
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

// todo useReducer
function DemoUseReducer() {
  const [number, dispatch] = useReducer((state, action) => {
    const { type, payload } = action
    switch (type) {
      case 'add':
        return state + 1
      case 'sub':
        return state - 1
      case 'reset':
        return payload
      default:
        return state
    }
  }, 0)
  return <div>
    当前值：{number}
    <button onClick={() => dispatch({ type: 'add' })}>增加</button>
    <button onClick={() => dispatch({ type: 'sub' })}>减少</button>
    <button onClick={() => dispatch({ type: 'reset', payload: 666 })}>赋值</button>
    <MyChildren dispatch={dispatch} state={{ number }}></MyChildren>
  </div>
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

const [age, setAge] = useState(10)
const jud = useMemo(() => {
  // 当age大于19后，这个函数会执行
  return age <= 18 ? '未成年' : '成年'
}, [age <= 18])

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

/** 
 * todo useLayoutEffect
 * useEffect执行顺序：组件更新挂载完成-》浏览器dom绘制完成-》执行useEffect回调
 * useLayoutEffect执行顺序：组件更新挂载完成-》执行userLayoutEffect回调-》浏览器dom绘制完成
 * 所以说useLayoutEffect代码可能会阻塞浏览器的绘制。我们写effect和useLayoutEffect，react在底层会被分别打上
 * PassiveEffect,HookLayout，在commit阶段区分出，在什么时机执行
 */
function DemoLayoutEffect() {
  const target = useRef()
  useLayoutEffect(() => {
    /* 我们需要在dom绘制之前，移动dom到指定位置 */
    const { x, y } = getPosition()
    animate(target.current, { x, y })
  }, [])
  return (
    <div>
      <span ref={target} className='animate'></span>
    </div>
  )
}

/**
 * todo useContext
 */
function DemoUseContext() {
  const value = useContext()
  return <div>my name is {value.name}</div>
}

/**
 * todo useImperativeHandle
 * useImperativeHandle可以配合forwardRef自定义暴露给父组件的实例值。这个很有用，我们知道，对于子组件，如果是class类组件，
 * 我们可能通过ref获取类组件的实例，但是在子组件是函数组件的情况，如果我们不能直接能ref的，那么此时userImperativeHandle
 * 和forwardRef配置就能达到效果
 * useImperativeHandle接受三个参数
 * 第一个参数：ref 接受forwardRef传递过来的ref
 * 第二个参数: createHandle 处理函数，返回值作为暴露给父组件的ref对象
 * 第三个参数: deps,依赖项更改形成新的ref对象
 */
function Son(props, ref) {
  const inputRef = useRef()
  const [inputValue, setInputValue] = useState('')

  useImperativeHandle(
    ref,
    () => {
      const handleRefs = {
        onfocus() {
          inputRef.current.focus()
        },
        onChangeValue(value) {
          setInputValue(value)
        }
      }
      return handleRefs
    },
    [],
  )

  return (
    <div>
      <input
        placeholder='请输入内容'
        ref={inputRef}
        value={inputValue}
      />
    </div>
  )
}
const ForwardSon = React.forwardRef(Son)

class Index extends React.Component {
  current = null
  handleClick() {
    const {onFocus, onChangeValue} = this.current
    onfocus()
    onChangeValue('let us learn React!')
  }
  render() {
    return (
      <div style={{marginTop: '50px'}}>
        <ForwardSon ref={current => this.current = current} />
        <button onClick={this.handleClick.bind(this)}>操控子组件</button>
      </div>
    )
  }
}