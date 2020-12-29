let logger = function({dispatch, getState}) {
  return function(next) {
    return function(action) {
      console.log('老状态', getState()) 
      next(action)
      console.log('新状态', getState())
    }
  }
}
export default logger