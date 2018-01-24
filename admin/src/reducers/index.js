import { combineReducers } from 'redux';
import modals from './modals';
import toasts from './toasts';

// Allow dependency injection of extra reducers, we need this for SSR
const getReducers = extraReducers => {
  return combineReducers({
    modals,
    toasts,
    ...extraReducers,
  });
};

export default getReducers;
