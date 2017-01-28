const initialState = {
	posts: null
}

export default function root(state = initialState, action) {
	switch (action.type) {
		case 'SET_POSTS':
			return Object.assign({}, state, {
				posts: action.posts
			})
		default:
			return state
	}
}
