import { combineReducers } from 'redux';
import { client } from '../api';
import modals from './modals';
import toasts from './toasts';

const apollo = client.reducer();

export default combineReducers({
  modals,
  toasts,
  apollo,
});
