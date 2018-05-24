// @flow
import { combineReducers } from 'redux';
import authentication, { type AuthenticationState } from './authentication';
import currentUserId, { type CurrentUserState } from './currentUserId';
import message from '../../src/reducers/message';

export type State = {
  +authentication: $Exact<AuthenticationState>,
  +currentUserId: CurrentUserState,
  +message: $Exact<$Call<typeof message, {}>>,
};

export default combineReducers({
  authentication,
  currentUserId,
  message,
});
