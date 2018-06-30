// @flow
import { combineReducers, type Reducer } from 'redux';
import authentication, { type AuthenticationState } from './authentication';
import toasts, { type ToastsState } from './toasts';
import message from '../../src/reducers/message';

export type State = {
  +authentication: $Exact<AuthenticationState>,
  +message: $Exact<$Call<typeof message, {}>>,
  +toasts: $Exact<ToastsState>,
};

// Allow dependency injection of extra reducers, we need this for SSR
const getReducers = (extraReducers: { [key: string]: Reducer<*, *> }) => {
  return combineReducers({
    authentication,
    message,
    toasts,
    ...extraReducers,
  });
};

export default getReducers;
