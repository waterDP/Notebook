import * as effectTypes from './effectTypes'

const makeEffect = (type, payload) => {
  return {type, payload}
}

export function take(pattern) {
  return makeEffect(effectTypes.TAKE, {pattern})
}

export function put(action) {
  return makeEffect(effectTypes.PUT, {action})
}