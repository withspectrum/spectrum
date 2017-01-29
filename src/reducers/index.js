import { combineReducers } from 'redux'
import user from './user'
import posts from './posts'
import frequencies from './frequencies'

export default combineReducers({
	user,
	posts,
	frequencies
})