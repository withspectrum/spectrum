import { combineReducers } from 'redux';
import { client } from '../api';
import users from './users';
import composer from './composer';
import modals from './modals';
import toasts from './toasts';
import directMessageThreads from './directMessageThreads';
import gallery from './gallery';

const apollo = client.reducer();

export default combineReducers({
  users,
  modals,
  toasts,
  directMessageThreads,
  gallery,
  apollo,
  composer,
});
