// @flow
import { SecureStore } from 'expo';

type AUTHENTICATE = {
  type: 'AUTHENTICATE',
  token: ?string,
};

type LOGOUT = {
  type: 'LOGOUT',
};

export type AuthenticateAction = AUTHENTICATE | LOGOUT;

export const authenticate = (token: ?string) => {
  return {
    type: 'AUTHENTICATE',
    token,
  };
};

export const logout = () => {
  SecureStore.deleteItemAsync('token');
  return {
    type: 'LOGOUT',
  };
};
