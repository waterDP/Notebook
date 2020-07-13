import {REACT_ELEMENT_TYPE} from '../shared/ReactSymbols'

/** 
 * @param {*} type
 * @param {*} props
 * @param {*} key
 * @param {string|object} ref
 * @param {*} owner
 * @param {*} self  
 * @param {*} source
 */
const ReactElement = function(type, key, ref, self, source, owner, props) {
  const element = {
    $$typeof: REACT_ELEMENT_TYPE,
    type,
    key,
    ref,
    props,
    _self: self,
    _source: source,
    _owner: owner
  }
  return element
}

export function createElement(type, config, children) {

  const props = {}

  let key = null
  let ref = null
  let self = null
  let source = null 

  return ReactElement(
    type,
    key,
    ref,
    self,
    source,
    props,
  )
}

