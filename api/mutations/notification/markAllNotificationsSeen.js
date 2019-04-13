// @flow
import type { GraphQLContext } from '../../';
import { markAllNotificationsSeen } from 'shared/db/queries/usersNotifications';
import { isAuthedResolver as requireAuth } from '../../utils/permissions';

export default requireAuth(
  async (_: any, __: any, { user }: GraphQLContext) => {
    return await markAllNotificationsSeen(user.id);
  }
);
