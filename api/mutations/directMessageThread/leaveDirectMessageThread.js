// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import {
  leaveDirectMessageThread,
  getDirectMessageThread,
} from '../../models/usersDirectMessageThreads';
import { isAuthedResolver as requireAuth } from '../../utils/permissions';

type ArchiveDMThreadInput = {
  input: {
    threadId: string,
  },
};

// prettier-ignore
export default requireAuth( async (_: any, args: ArchiveDMThreadInput, ctx: GraphQLContext) => {
  const { input: { threadId } } = args
  const { user: currentUser } = ctx

  if (!threadId) {
    return new UserError('We had trouble leaving this direct message thread - please try again.');
  }

  const [ directMessageThread ] = await getDirectMessageThread(
    threadId,
    currentUser.id
  );

  if (!directMessageThread) {
    return new UserError('This direct message thread does not exist.');
  }

  if (!directMessageThread.isGroup) {
    return new UserError('Only group messages can be left.')
  }

  try {
    return await leaveDirectMessageThread(directMessageThread.id);
  } catch (e) {
    return new UserError('An error occured while leaving this thread. Please try again');
  }
})
