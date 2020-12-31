 
import * as effectTypes from './effectTypes'

function runTakeEffect(env, payload, next) {
  const matcher = input => input.type === payload.pattern
  env.channel.take(next, matcher) // 订阅监听
}

function runPutEffect(env, payload, next) {
  env.dispatch(payload.action)
  next()
}

export default {
  [effectTypes.TAKE]: runTakeEffect,
  [effectTypes.PUT]: runPutEffect
}