// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { markAllNotificationsSeen } from '../../models/usersNotifications';

export default (_: any, __: any, { user }: GraphQLContext) => {
  if (!user)
    return new UserError('You must be logged in to view notifications');
  return markAllNotificationsSeen(user.id);
};
