import proc from './proc'
export function runSaga({channel, dispatch, getState}, saga) {
  let iterator = saga()
  const env = {
    channel, dispatch, getState
  }
  proc(env, iterator)
}