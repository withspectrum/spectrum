// @flow
/* eslint-disable */
import { createStore, compose, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import crashReporter from 'src/helpers/sentry-redux-middleware';
import getReducers from '../reducers';

// this enables the chrome devtools for redux only in development
const composeEnhancers =
  (process.env.NODE_ENV !== 'production' &&
    typeof window !== 'undefined' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

// init the store with the thunkMiddleware which allows us to make async actions play nicely with the store
// Allow dependency injection of extra reducers and middleware, we need this for SSR
export const initStore = (initialState?: Object) => {
  let store = createStore(
    getReducers(),
    initialState || {},
    composeEnhancers(applyMiddleware(thunkMiddleware, crashReporter))
  );

  if (module.hot && typeof module.hot.accept === 'function') {
    module.hot.accept('../reducers', () => {
      const nextGetReducers = require('../reducers/index').default;
      store.replaceReducer(nextGetReducers());
    });
  }

  return store;
};
