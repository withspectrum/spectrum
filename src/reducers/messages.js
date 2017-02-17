const initialState = {
	messages: []
}

export default function root(state = initialState, action) {
	switch (action.type) {
		case 'SET_MESSAGES':
			return Object.assign({}, state, {
				messages: action.messages
			})
		case 'SET_ACTIVE_STORY':
		case 'CLEAR_MESSAGE':
		case 'CLEAR_STORY':
			return Object.assign({}, state, {
				messages: ''
			})
		case 'SEND_MESSAGE':
			let newMessages = state.messages
			console.log('new messages are: ', newMessages)
			newMessages.push(action.message)
			return Object.assign({}, state, {
				messages: newMessages
			})
		default:
			return state
	}
}
