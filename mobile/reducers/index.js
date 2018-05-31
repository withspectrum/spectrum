// @flow
import { combineReducers } from 'redux';
import authentication, { type AuthenticationState } from './authentication';
import message from '../../src/reducers/message';

export type State = {
  +authentication: $Exact<AuthenticationState>,
  +message: $Exact<$Call<typeof message, {}>>,
};

export default combineReducers({
  authentication,
  message,
});
