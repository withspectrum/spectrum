// @flow

export const authenticate = (token: ?string) => {
  return {
    type: 'AUTHENTICATE',
    token,
  };
};
