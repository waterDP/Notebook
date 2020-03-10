import {vnode} from "./create-element"


/*
  <div id='container'>
    <span style='color: red'>hello</span>
    zf
  </div>
  let old = h('div', {id: 'container'}, 
    h('span', {style: {color: 'red'}}, 'hello),
    'zf'
  )
*/

export default function h (tag, props, ...children) {
  let key = props.key
  delete props.key  // 属性中不包括key属性
  children = children.map(child => {
    if (typeof child === 'object') {
      return child
    }
    return vnode(tag, props, key, children)
  })
}