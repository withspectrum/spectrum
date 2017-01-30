import { combineReducers } from 'redux'
import user from './user'
import stories from './stories'
import frequencies from './frequencies'
import messages from './messages'

export default combineReducers({
	user,
	stories,
	frequencies,
	messages
})