// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import {
  checkForExistingDMThread,
  getDirectMessageThread,
  createDirectMessageThread,
  setDirectMessageThreadLastActive,
} from '../../models/directMessageThread';
import {
  setUserLastSeenInDirectMessageThread,
  createMemberInDirectMessageThread,
} from '../../models/usersDirectMessageThreads';
import { addMessage } from '../message/addMessage';
import type { FileUpload } from 'shared/types';
import { isAuthedResolver as requireAuth } from '../../utils/permissions';
import type { MessageType } from 'shared/draft-utils/message-types';

export type CreateDirectMessageThreadInput = {
  input: {
    participants: Array<string>,
    message: {
      messageType: MessageType,
      threadType: 'directMessageThread',
      content: {
        body: string,
      },
      file?: FileUpload,
    },
  },
};

export default requireAuth(
  async (_: any, args: CreateDirectMessageThreadInput, ctx: GraphQLContext) => {
    const { user } = ctx;
    const { input } = args;

    if (!input.participants) {
      return new UserError('Nobody was selected to create a thread.');
    }

    // if users and messages exist, continue
    const { participants, message } = input;

    // if the group being created has more than one participant, a group
    // thread is being created - this means that people can be added
    // and removed from the thread in the future. we *don't* want this
    // behavior for 1:1 threads to preserve privacy, so we store an `isGroup`
    // boolean on the dmThread object itself which will be used in other
    // mutations to add or remove members
    const isGroup = participants.length > 1;

    // collect all participant ids and the current user id into an array - we
    // use this to determine if an existing DM thread with this exact
    // set of participants already exists or not
    const allMemberIds = [...participants, user.id];

    // placeholder
    let threadId, threadToReturn;

    // check to see if a dm thread with this exact set of participants exists
    const existingThread = await checkForExistingDMThread(allMemberIds);

    if (existingThread) {
      threadId = existingThread;
      threadToReturn = await getDirectMessageThread(threadId);
    } else {
      threadToReturn = await createDirectMessageThread(isGroup, user.id);
      threadId = threadToReturn.id;
    }

    if (existingThread) {
      return await Promise.all([
        setUserLastSeenInDirectMessageThread(threadId, user.id),
        setDirectMessageThreadLastActive(threadId),
        addMessage(
          {
            ...message,
            threadId,
          },
          user.id
        ),
      ]).then(() => threadToReturn);
    }

    return await Promise.all([
      createMemberInDirectMessageThread(threadId, user.id, true),
      addMessage(
        {
          ...message,
          threadId,
        },
        user.id
      ),
      participants.map(participant => {
        return createMemberInDirectMessageThread(threadId, participant, false);
      }),
    ]).then(() => threadToReturn);
  }
);
