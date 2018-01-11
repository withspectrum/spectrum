// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { markDirectMessageNotificationsSeen } from '../../models/usersNotifications';

export default (_: any, __: any, { user }: GraphQLContext) => {
  if (!user)
    return new UserError('You must be logged in to view notifications');
  return markDirectMessageNotificationsSeen(user.id);
};
