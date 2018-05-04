// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import {
  updateIsDirectMessageThreadArchived,
  getDirectMessageThread,
} from '../../models/usersDirectMessageThreads';

type isArchivedDMThreadInput = {
  input: {
    isArchived: boolean,
    threadId: string,
  },
};

export default async (
  _: any,
  { input }: isArchivedDMThreadInput,
  { user }: GraphQLContext
) => {
  const currentUser = user;

  if (!currentUser) {
    return new UserError('You must be signed in to archive a message.');
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

  const { isArchived } = input;

  try {
    await updateIsDirectMessageThreadArchived(
      directMessageThread.id,
      isArchived
    );

    return directMessageThread;
  } catch (e) {
    return new UserError('We could not archive your message. Please try again');
  }
};
