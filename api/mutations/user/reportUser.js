// @flow
import { isAuthedResolver } from '../../utils/permissions';
import UserError from '../../utils/UserError';
import { sendUserReportedEmail } from 'shared/bull/queues';
import type { GraphQLContext } from '../../';

type ReportUserInput = {
  input: {
    userId: string,
    message: string,
  },
};

export default isAuthedResolver(
  async (
    _: any,
    { input: { userId, message } }: ReportUserInput,
    { loaders, user }: GraphQLContext
  ) => {
    if (user.id === userId) return new UserError('You cannot report yourself.');
    const reportedUser = await loaders.user.load(userId);
    if (!reportedUser)
      return new UserError(`User with ID ${userId} does not exist.`);

    try {
      await sendUserReportedEmail.add({
        userId,
        message,
        reportedBy: user.id,
        reportedAt: new Date(),
      });
    } catch (err) {
      console.error(err);
      return false;
    }
    return true;
  }
);
