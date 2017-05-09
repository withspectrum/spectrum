import { combineReducers } from 'redux';
import { client } from '../api';
import users from './users';
import modals from './modals';

const apollo = client.reducer();

export default combineReducers({
  users,
  modals,
  apollo,
});
