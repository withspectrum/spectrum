/* eslint-disable */
import { createStore, compose, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import getReducers from './index';

// this enables the chrome devtools for redux only in development
const composeEnhancers = compose;

// init the store with the thunkMiddleware which allows us to make async actions play nicely with the store
// Allow dependency injection of extra reducers and middleware, we need this for SSR
export const initStore = (
  initialState,
  { middleware = [], reducers = {} } = {}
) => {
  if (initialState) {
    return createStore(
      getReducers(reducers),
      initialState,
      composeEnhancers(applyMiddleware(...middleware, thunkMiddleware))
    );
  } else {
    return createStore(
      getReducers(reducers),
      {},
      composeEnhancers(applyMiddleware(...middleware, thunkMiddleware))
    );
  }
};
