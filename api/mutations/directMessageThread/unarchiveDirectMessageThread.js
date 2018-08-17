// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import {
  unarchiveDirectMessageThread,
  getDirectMessageThread,
} from '../../models/usersDirectMessageThreads';
import { isAuthedResolver as requireAuth } from '../../utils/permissions';

type UnarchiveDMThreadInput = {
  input: {
    threadId: string,
  },
};

// prettier-ignore
export default requireAuth( async (_: any, args: UnarchiveDMThreadInput, ctx: GraphQLContext) => {
  const { input: { threadId }} = args
  const { user: currentUser } = ctx

  if (!threadId) {
    return new UserError('A threadId is required.');
  }

  const [directMessageThread] = await getDirectMessageThread(
    threadId,
    currentUser.id
  );

  if (!directMessageThread) {
    return new UserError('This direct message thread does not exist.');
  }

  try {
    return await unarchiveDirectMessageThread(directMessageThread.id);
  } catch (e) {
    return new UserError('We could not unarchive your message. Please try again');
  }
})
