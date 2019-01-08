// @flow
import type { GraphQLContext } from '../../';
import { convertToRaw } from 'draft-js';
import { stateFromMarkdown } from 'draft-js-import-markdown';
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
    messageType?: 'draftjs' | 'text' | 'media',
    content: {
      body: string,
    },
  },
};

export default requireAuth(async (_: any, args: Args, ctx: GraphQLContext) => {
  const {
    input: { id, content, messageType },
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

  let body = content.body;
  if (messageType === 'text') {
    body = JSON.stringify(convertToRaw(stateFromMarkdown(body)));
    messageType === 'draftjs';
  }

  const eventFailed =
    message.threadType === 'story'
      ? events.MESSAGE_EDITED_FAILED
      : events.DIRECT_MESSAGE_EDITED_FAILED;

  if (messageType === 'draftjs') {
    let parsed;
    try {
      parsed = JSON.parse(body);
    } catch (err) {
      trackQueue.add({
        userId: user.id,
        event: eventFailed,
        properties: {
          reason: 'invalid draftjs data',
          message,
        },
      });

      return new UserError(
        'Please provide serialized raw DraftJS content state as content.body'
      );
    }
    if (!parsed.blocks || !Array.isArray(parsed.blocks) || !parsed.entityMap) {
      trackQueue.add({
        userId: user.id,
        event: eventFailed,
        properties: {
          reason: 'invalid draftjs data',
          message,
        },
      });

      return new UserError(
        'Please provide serialized raw DraftJS content state as content.body'
      );
    }
    if (
      parsed.blocks.some(
        ({ type }) =>
          !type ||
          (type !== 'unstyled' &&
            type !== 'code-block' &&
            type !== 'blockquote')
      )
    ) {
      trackQueue.add({
        userId: user.id,
        event: eventFailed,
        properties: {
          reason: 'invalid draftjs data',
          message,
        },
      });

      return new UserError(
        'Invalid DraftJS block type specified. Supported block types: "unstyled", "code-block".'
      );
    }
  }

  if (body === message.content.body) {
    return message;
  }

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

  return editMessage(
    {
      ...args.input,
      content: {
        body,
      },
      messageType,
    },
    user.id
  );
});
