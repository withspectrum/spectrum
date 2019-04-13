// @flow
import { isAuthedResolver } from '../../utils/permissions';
import UserError from '../../utils/UserError';
import { _adminProcessUserReportedQueue } from 'shared/bull/queues';
import type { GraphQLContext } from '../../';
import { events } from 'shared/analytics';
import { trackQueue } from 'shared/bull/queues';

type ReportUserInput = {
  input: {
    userId: string,
    reason: string,
  },
};

export default isAuthedResolver(
  async (_: any, args: ReportUserInput, ctx: GraphQLContext) => {
    const {
      input: { userId, reason },
    } = args;
    const { loaders, user: currentUser } = ctx;

    if (currentUser.id === userId) {
      return new UserError('You cannot report yourself.');
    }

    const reportedUser = await loaders.user.load(userId);

    if (!reportedUser) {
      return new UserError(`User with ID ${userId} does not exist.`);
    }

    try {
      trackQueue.add({
        userId,
        event: events.USER_WAS_REPORTED,
        properties: {
          reason,
          reportedBy: currentUser.id,
        },
      });

      trackQueue.add({
        userId: currentUser.id,
        event: events.USER_REPORTED_USER,
        properties: {
          reason,
          reportedUser: userId,
        },
      });

      await _adminProcessUserReportedQueue.add({
        userId,
        reason,
        reportedBy: currentUser.id,
        reportedAt: new Date(),
      });
    } catch (err) {
      console.error(err);
      return false;
    }
    return true;
  }
);
