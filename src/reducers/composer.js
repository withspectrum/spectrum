const initialState = {
	isOpen: false
}

export default function root(state = initialState, action) {
	switch (action.type) {
		case 'TOGGLE_COMPOSER_OPEN':
			return Object.assign({}, state, {
				isOpen: action.isOpen
			})
		default:
			return state
	}
}
