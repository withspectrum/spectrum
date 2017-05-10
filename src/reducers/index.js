import { combineReducers } from 'redux';
import { client } from '../api';
import users from './users';
import modals from './modals';
import toasts from './toasts';

const apollo = client.reducer();

export default combineReducers({
  users,
  modals,
  toasts,
  apollo,
});
