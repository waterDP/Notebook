function createThunkMiddleware(extraArgument) {
	return function ({ dispatch, getState }) {
		return function (next) {
			return function (action) {
				if (typeof action === 'function') {
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