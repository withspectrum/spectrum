const initialState = {
	uid: null,
	loginError: null,
	displayName: null,
	photoURL: null,
	frequencies: null,
	customerId: null,
	subscriptions: null
}

export default function root(state = initialState, action) {
	switch (action.type) {
		case 'LOGIN_SIGNUP_ERROR':
			return Object.assign({}, state, {
				loginError: action.message
			})
		case 'SET_USER':
			return Object.assign({}, state, {
				uid: action.user.uid,
				photoURL: action.user.photoURL,
				displayName: action.user.displayName,
				frequencies: action.user.frequencies,
				customerId: action.user.customerId || null
			})
		case 'SET_SUBSCRIPTIONS':
			return Object.assign({}, state, {
				subscriptions: action.subscriptions
			})
		default:
			return state
	}
}
