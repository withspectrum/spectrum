// @flow
import type { GraphQLContext } from '../../';
import { markDirectMessageNotificationsSeen } from '../../models/usersNotifications';
import { isAuthedResolver as requireAuth } from '../../utils/permissions';

export default requireAuth(
  async (_: any, __: any, { user }: GraphQLContext) => {
    return markDirectMessageNotificationsSeen(user.id);
  }
);
