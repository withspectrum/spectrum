// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import {
  getMessage,
  editMessage,
  userHasMessagesInThread,
  getMessages,
} from '../../models/message';
import { setThreadLastActive } from '../../models/thread';
import { deleteParticipantInThread } from '../../models/usersThreads';
import { getUserPermissionsInChannel } from '../../models/usersChannels';
import { getUserPermissionsInCommunity } from '../../models/usersCommunities';
import { events } from 'shared/analytics';
import { isAuthedResolver as requireAuth } from '../../utils/permissions';
import { trackQueue } from 'shared/bull/queues';

type Args = {
  input: {
    id: string,
    content: {
      body: string,
    },
  },
};

export default requireAuth(async (_: any, args: Args, ctx: GraphQLContext) => {
  const {
    input: { id, content },
  } = args;
  const { user, loaders } = ctx;

  const message = await getMessage(id);

  if (!message) {
    trackQueue.add({
      userId: user.id,
      event: events.MESSAGE_EDITED_FAILED,
      properties: {
        reason: 'message not found',
      },
    });
    return new UserError('This message does not exist.');
  }

  if (content.body === message.content.body) {
    return message;
  }

  const eventFailed =
    message.threadType === 'story'
      ? events.MESSAGE_EDITED_FAILED
      : events.DIRECT_MESSAGE_EDITED_FAILED;

  if (message.senderId !== user.id) {
    trackQueue.add({
      userId: user.id,
      event: eventFailed,
      context: { messageId: id },
      properties: {
        reason: 'message not sent by user',
      },
    });

    return new UserError('You can only edit your own messages.');
  }

  return editMessage(args.input, user.id);
});
