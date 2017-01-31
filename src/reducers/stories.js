const initialState = {
	stories: [],
	active: null
}

export default function root(state = initialState, action) {
	switch (action.type) {
		case 'SET_STORIES':
			return Object.assign({}, state, {
				stories: action.stories
			})
		case 'SET_ACTIVE_STORY':
			return Object.assign({}, state, {
				active: action.id
			})
		default:
			return state
	}
}
