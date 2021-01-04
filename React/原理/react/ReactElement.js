import { ELEMENT, TEXT } from "../shared/constants"
import {ReactElement} from './vdom'
 
export function createElement(type, config = {}, ...children) {
  let { key, ref, ...props } = config
  let $$typeof = null
  if (typeof type === 'string' || typeof type === 'number') {
    $$typeof = ELEMENT
  }
  props.children = children.map(item => {
    if (typeof item === 'object') {
      return item
    } else {
      return {
        $$typeof: TEXT,
        type: TEXT,
        content: item
      }
    }
  })


  return ReactElement($$typeof, type, key, ref, props )
}

// vdom
function ReactElement($$typeof, type, key, ref, props) {
  return {
    $$typeof,
    type,
    key,
    ref,
    props
  }
}