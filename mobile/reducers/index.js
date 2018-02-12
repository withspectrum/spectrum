// @flow
import { combineReducers } from 'redux';
import authentication, { type AuthenticationState } from './authentication';

export type State = {
  +authentication: $Exact<AuthenticationState>,
};

export default combineReducers({
  authentication,
});
