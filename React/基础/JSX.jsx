  // 实际上，jsx仅仅只是React.createElement(component, props, ...children)函数的语法糖。如下的jsx代码
<MyComponent color="blue" shadowSize={2}>
  Click Me
</MyComponent>

// 以上会编译为
React.createElement(
  MyButton,
  {color: 'blue', shadowSize: 2},
  'Click Me'
)

// todo 在JSX类型中使用点的语法 
/* 
  在jsx中，你也可以使用点语法引用一个React组件。当你在一个模块中导出许多React组件时，这会非常方便。
  例如MyComponent.DatePicker是一个组件，你可以在jsx中直接使用
*/

import React from 'react'

class MyComponents {
  DatePicker(props) {
    return <div>Imagine a {props.color} datepicker here.</div>
  }
}

function BlueDatePicker() {
  return <MyComponents.DatePicker color="blue" />
}

// todo 在运行时选择类型
import React from 'react'
import {PhotoStory, VideoStory} from './stories'

const components = {
  photo: PhotoStory,
  video: VideoStory
}

function Story(props) {
  const SpecificStory = components[props.storyType]
  return <SpecificStory story={props.story} />
}

