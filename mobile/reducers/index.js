// @flow
import { combineReducers } from 'redux';
import authentication, { type AuthenticationState } from './authentication';
import currentUserId, { type CurrentUserState } from './currentUserId';

export type State = {
  +authentication: $Exact<AuthenticationState>,
  +currentUserId: CurrentUserState,
};

export default combineReducers({
  authentication,
  currentUserId,
});
