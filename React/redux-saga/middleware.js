import {stdChannel } from './channel'
import {runSaga} from './runSaga'

function sagaMiddlewareFactory() {
  const channel = stdChannel()
  let boundRunSaga // 开始执行saga
  function sagaMiddleware({getState, dispatch}) {
    boundRunSaga = runSaga.bind(null, {
      channel,
      dispatch,
      getState
    })
    return function(next) {
      return function(action) {
        let result = next(action) // 以后调用dispatch的时候，除了调用老的store.dispatch之外， 
        channel.put(action)  // 还需要调用channel.put方法
        return result
      }
    }
  }

  sagaMiddleware.run = (rootSaga) => {
    boundRunSaga(rootSaga)
  }

  return sagaMiddleware
}

export default sagaMiddlewareFactory