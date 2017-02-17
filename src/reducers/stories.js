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
		case 'CREATE_STORY':
			return Object.assign({}, state, {
				stories: state.stories.concat([action.story]),
				active: action.story.id,
			})
		case 'SET_ACTIVE_STORY':
			return Object.assign({}, state, {
				active: action.id
			})
		case 'DELETE_STORY':
			const stories = state.stories.slice().filter(story => story.id !== action.id)
			return Object.assign({}, state, { stories })
		case 'TOGGLE_STORY_LOCK':
			const foo = state.stories.slice().map(story => {
				if (story.id !== action.id) return story

				return {
					...story,
					locked: !action.locked,
				}
			})
			return Object.assign({}, state, { stories: foo })
		case 'ADD_FREQUENCY':
			return Object.assign({}, state, {
				active: null,
			})
		default:
			return state
	}
}
