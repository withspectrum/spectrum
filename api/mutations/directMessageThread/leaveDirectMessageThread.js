// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import {
  leaveDirectMessageThread,
  getDirectMessageThread,
} from '../../models/usersDirectMessageThreads';

type archiveDMThreadInput = {
  input: {
    threadId: string,
  },
};

export default async (
  _: any,
  { input }: archiveDMThreadInput,
  { user }: GraphQLContext
) => {
  const currentUser = user;

  if (!currentUser) {
    return new UserError(
      'You must be signed in to leave a direct message thread.'
    );
  }

  if (!input.threadId) {
    return new UserError('A threadId is required.');
  }

  const [directMessageThread] = await getDirectMessageThread(
    input.threadId,
    currentUser.id
  );

  if (!directMessageThread) {
    return new UserError('This direct message thread does not exist.');
  }

  try {
    const { changes } = await leaveDirectMessageThread(directMessageThread.id);

    return changes[0].new_val;
  } catch (e) {
    return new UserError('We could not archive your message. Please try again');
  }
};
