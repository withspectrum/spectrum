/* eslint-disable */
import { createStore, compose, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import crashReporter from './EventTracker';
import reducers from './reducers';

// this enables the chrome devtools for redux only in development
const composeEnhancers = process.env.NODE_ENV !== 'production' &&
  typeof window !== 'undefined' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ||
  compose;

// init the store with the thunkMiddleware which allows us to make async actions play nicely with the store
export const initStore = initialState => {
  if (initialState) {
    return createStore(
      reducers,
      initialState,
      composeEnhancers(applyMiddleware(thunkMiddleware, crashReporter)),
    );
  } else {
    return createStore(
      reducers,
      {},
      composeEnhancers(applyMiddleware(thunkMiddleware, crashReporter)),
    );
  }
};
