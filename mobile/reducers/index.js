// @flow
import { combineReducers } from 'redux';
import authentication, { type AuthenticationState } from './authentication';
import message, { type MessageState } from '../../src/reducers/message';

export type ReduxState = {
  +authentication: $Exact<AuthenticationState>,
  +message: $Exact<MessageState>,
};

export default combineReducers({
  authentication,
  message,
});
