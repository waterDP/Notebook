function isPromise(obj) {
  return !!obj && (typeof obj == 'object' || typeof obj == 'function') && (typeof obj.then == 'function')
}
export default function ({ dispatch, getState }) {
  return next => action => {
    return isPromise(action.payload) ? action.payload.then(result => {
      dispatch({ ...action, payload: result })
    }).catch((error) => {
      dispatch({ ...action, payload: error, error: true })
      return Promise.reject(error)
    }) : next(action)
  }
}