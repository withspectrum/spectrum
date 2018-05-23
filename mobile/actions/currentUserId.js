// @flow

export type SetCurrentUserAction = {
  type: 'SET_CURRENT_USER_ID',
  id: ?string,
};

export const setCurrentUserId = (id: ?string) => {
  return {
    type: 'SET_CURRENT_USER_ID',
    id,
  };
};
