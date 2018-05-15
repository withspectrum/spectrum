// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import {
  unarchiveDirectMessageThread,
  getDirectMessageThread,
} from '../../models/usersDirectMessageThreads';

type unarchiveDMThreadInput = {
  input: {
    threadId: string,
  },
};

export default async (
  _: any,
  { input }: unarchiveDMThreadInput,
  { user }: GraphQLContext
) => {
  const currentUser = user;

  if (!currentUser) {
    return new UserError('You must be signed in to unarchive a message.');
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
    const { changes } = await unarchiveDirectMessageThread(
      directMessageThread.id
    );

    console.log(changes);

    return changes[0].new_val;
  } catch (e) {
    return new UserError(
      'We could not unarchive your message. Please try again'
    );
  }
};
