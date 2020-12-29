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
const thunk = createThunkMiddleware()
thunk.withExtraArgument = createThunkMiddleware
export default thunk