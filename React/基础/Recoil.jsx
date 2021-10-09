/*
 * @Description: //
 * @Date: 2021-10-09 15:43:11
 * @Author: water.li
 */
import React from 'react';
import ReactDOM from 'react-dom';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue
} from 'recoil'

const App = () => {
  return (
    <RecoilRoot>
      <CharacterCounter></CharacterCounter>
    </RecoilRoot>
  )
}

/**
 * 一个atom代表一个状态。Atom可以任意组件中读写
 * 读取atom值的组件隐匿订阅了该atom，因此任何atom的更新都奖使使用了对应atom的组件重新渲染
 */
const textState = atom({
  key: 'textState',
  default: ''
})

const CharacterCounter = () => {
  return (
    <div>
      <TextInput></TextInput>
      <CharacterCount></CharacterCount>
    </div>
  )
}

const TextInput = () => {
  const [text, setText] = useRecoilState(textState)

  const onChange = (event) => {
    setText(event.target.value)
  }

  return (
    <div>
      <input type="text" value={text} onChange={onChange} />
      <br />
      Echo: {text}
    </div>
  )
}

/**
 * selector 代表一个派生状态，派生状态是的状态的转换
 * 你可以将派生状态视为状态传递给以某种方式修改给定状态的纯函数的输出
 * todo vue中的 computed
 */
const charCountState = selector({
  key: 'charCountState',
  get: ({get}) => {
    const text = get(textState) 
    return text.length
  }
})

const CharacterCount = () => {
  const count = useRecoilValue(charCountState)

  return <>Character Count: {count}</>
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
