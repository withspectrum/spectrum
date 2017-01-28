const initialState = {
	uid: null,
	loginError: null
}

export default function root(state = initialState, action) {
	switch (action.type) {
		case 'LOGGED_IN':
			return Object.assign({}, state, {
				uid: action.uid,
				loginError: null
			})
		case 'LOGIN_SIGNUP_ERROR':
			return Object.assign({}, state, {
				loginError: action.message
			})
		default:
			return state
	}
}
