// @flow
import { isAuthedResolver } from '../../utils/permissions';
import UserError from '../../utils/UserError';
import { _adminProcessUserReportedQueue } from 'shared/bull/queues';
import type { GraphQLContext } from '../../';

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
