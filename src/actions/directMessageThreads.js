export const initNewThreadWithUser = (users: Object) => {
  return {
    type: 'ADD_USERS_DIRECT_MESSAGES_COMPOSER',
    payload: users,
  };
};

export const clearDirectMessagesComposer = () => {
  return {
    type: 'CLEAR_DIRECT_MESSAGES_COMPOSER',
  };
};
