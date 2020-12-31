import effectRunnerMap from './effectRunnerMap'

/**
 * co 原理，自动执行迭代器
 */
export default function proc(env, iterator) {
  function next(args) {
    let result = iterator.next(args)
    result.done || runEffect(result.value, next)
  }
  function runEffect(effect, next) {
    if (effect) {
      const effectRunner = effectRunnerMap[effect.type]
      effectRunner(env, effect.payload, next)
    } else {
      next()
    }
  }
  next()
}

