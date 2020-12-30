function createThunkMiddleware(extraArgument) {
	return function ({ dispatch, getState }) {
		return function (next) {
			return function (action) {
				if (typeof action === 'function') {
					// todo 这里相当于外部不会再去调用store.dispatch方法，而、是把传入到action函数中，如果需要调用再去调用dispatch方法
					return action(dispatch, getState, extraArgument) 
				}

				next(action)
      }
		}
	}
}
const thunk = createThunkMiddleware()  // thunk 这样使用是没有额外参数的版本
thunk.withExtraArgument = createThunkMiddleware  // thunk.withExtraArgument(params) 这样是用额外参数的版本
export default thunk