// @flow

export default (_, { id }, { user }) => {
  if (!user)
    return new UserError('You must be logged in to view notifications');
  return markSingleNotificationSeen(id, user.id);
};
