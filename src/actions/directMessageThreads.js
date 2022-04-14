export const initNewThreadWithUser = (user: Object) => {
  return {
    type: 'ADD_USERS_DIRECT_MESSAGES_COMPOSER',
    payload: user,
  };
};

export const clearDirectMessagesComposer = () => {
  return {
    type: 'CLEAR_DIRECT_MESSAGES_COMPOSER',
  };
};
