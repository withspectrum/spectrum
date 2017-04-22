import { combineReducers } from 'redux';
import { client } from '../api';
import users from './users';

const apollo = client.reducer();

export default combineReducers({
  users,
  apollo,
});
