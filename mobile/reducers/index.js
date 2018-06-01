// @flow
import { combineReducers } from 'redux';
import authentication, { type AuthenticationState } from './authentication';
import message, { type MessageState } from '../../src/reducers/message';
import { threadReducer as thread, type ThreadState } from './thread';

export type ReduxState = {
  +authentication: $Exact<AuthenticationState>,
  +message: $Exact<MessageState>,
  +thread: $Exact<ThreadState>,
};

export default combineReducers({
  authentication,
  message,
  thread,
});
