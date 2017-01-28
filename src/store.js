import { createStore, compose, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import reducers from './reducers'

const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose

export const initStore = (initialState) => {
  return createStore(reducers, initialState, composeEnhancers(
		applyMiddleware(thunkMiddleware)
	))
}
