/* eslint-disable */
import { createStore, compose, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducers from './reducers';

// this enables the chrome devtools for redux
const composeEnhancers = typeof window !== 'undefined' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ||
  compose;

// init the store with the thunkMiddleware which allows us to make async actions play nicely with the store
export const initStore = initialState => {
  if (initialState) {
    return createStore(
      reducers,
      initialState,
      composeEnhancers(applyMiddleware(thunkMiddleware)),
    );
  } else {
    return createStore(
      reducers,
      {},
      composeEnhancers(applyMiddleware(thunkMiddleware)),
    );
  }
};
