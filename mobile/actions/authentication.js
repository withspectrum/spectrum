// @flow

export type AuthenticateAction = {
  type: 'AUTHENTICATE',
  token: ?string,
};

export const authenticate = (token: ?string) => {
  return {
    type: 'AUTHENTICATE',
    token,
  };
};
