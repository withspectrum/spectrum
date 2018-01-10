// @flow

export default (_, __, { user }) => {
  if (!user)
    return new UserError('You must be logged in to view notifications');
  return markAllNotificationsRead(user.id);
};
