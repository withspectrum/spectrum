import { combineReducers } from 'redux'
import user from './user'
import posts from './posts'

export default combineReducers({
	user,
	posts
})