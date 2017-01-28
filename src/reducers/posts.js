const initialState = {
	posts: null
}

export default function root(state = initialState, action) {
	switch (action.type) {
		case 'SET_POSTS':
			return Object.assign({}, state, {
				posts: action.posts
			})
		case 'CREATE_POST':
			const posts = state.posts.slice()
			posts.push(action.post)
			return Object.assign({}, state, { posts })
		default:
			return state
	}
}
