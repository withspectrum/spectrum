const initialState = {
	frequencies: null,
	active: null
}

export default function root(state = initialState, action) {
	switch (action.type) {
		case 'SET_FREQUENCIES':
			return Object.assign({}, state, {
				frequencies: action.frequencies
			})
		case 'SET_ACTIVE_FREQUENCY':
			return Object.assign({}, state, { 
				active: action.id 
			})
		default:
			return state
	}
}
