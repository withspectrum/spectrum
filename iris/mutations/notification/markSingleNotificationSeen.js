// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { markSingleNotificationSeen } from '../../models/usersNotifications';

export default (_: any, { id }: { id: string }, { user }: GraphQLContext) => {
  if (!user)
    return new UserError('You must be logged in to view notifications');
  return markSingleNotificationSeen(id, user.id);
};
