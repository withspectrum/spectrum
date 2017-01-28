const initialState = {
	test: null
}

export default function root(state = initialState, action) {
	switch (action.type) {
		case 'TEST_REDUX':
			return Object.assign({}, state, {
				test: action.test
			})
		default:
			return state
	}
}
