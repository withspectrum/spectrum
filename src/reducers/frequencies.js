const initialState = {
	frequencies: null
}

export default function root(state = initialState, action) {
	switch (action.type) {
		case 'SET_FREQUENCIES':
			return Object.assign({}, state, {
				frequencies: action.frequencies
			})
		default:
			return state
	}
}
