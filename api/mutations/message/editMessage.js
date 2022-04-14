// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { getMessage, editMessage } from '../../models/message';
import { isAuthedResolver as requireAuth } from '../../utils/permissions';
import { validateRawContentState } from '../../utils/validate-draft-js-input';
import processMessageContent, {
  messageTypeObj,
} from 'shared/draft-utils/process-message-content';
import type { MessageType } from 'shared/draft-utils/message-types';

type Args = {
  input: {
    id: string,
    messageType?: MessageType,
    content: {
      body: string,
    },
  },
};

export default requireAuth(async (_: any, args: Args, ctx: GraphQLContext) => {
  let messageType = args.input.messageType;
  const {
    input: { id, content },
  } = args;
  const { user } = ctx;

  const message = await getMessage(id);

  if (!message) {
    return new UserError('This message does not exist.');
  }

  let body = content.body;
  if (messageType === messageTypeObj.text) {
    body = processMessageContent(messageTypeObj.text, body);
    messageType = messageTypeObj.draftjs;
  }
  if (messageType === messageTypeObj.draftjs) {
    let parsed;
    try {
      parsed = JSON.parse(body);
    } catch (err) {
      return new UserError(
        'Please provide serialized raw DraftJS content state as content.body'
      );
    }
    if (!validateRawContentState(parsed)) {
      throw new UserError(
        'Please provide serialized raw DraftJS content state as content.body'
      );
    }
  }

  if (body === message.content.body) {
    return message;
  }

  if (message.senderId !== user.id) {
    return new UserError('You can only edit your own messages.');
  }

  return editMessage({
    ...args.input,
    content: {
      body,
    },
    messageType,
  });
});
