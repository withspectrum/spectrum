// @flow
const debug = require('debug')(
  'athena:queue:format-and-buffer-notification-email'
);
import { getCommunityById } from '../../models/community';
import { getChannelById } from '../../models/channel';
import { toPlainText, toState } from 'shared/draft-utils';
import bufferNotificationEmail from './buffer-email';

type UserType = {
  id: string,
  profilePhoto: string,
  name: string,
  username: string,
};
type MessageType = {
  id: string,
  content: {
    body: string,
  },
};
type RecipientType = {
  email: string,
  username: string,
  userId: string,
  name: string,
};
type NotificationType = {};
type ThreadType = {
  id: string,
  channelId: string,
  communityId: string,
};

export default async (
  recipient: RecipientType,
  thread: ThreadType,
  user: UserType,
  message: MessageType,
  notification: NotificationType
) => {
  if (!recipient || !recipient.email || !thread || !user || !message) {
    debug(
      '⚠ aborting adding to email queue due to invalid data\nrecipient\n%O\nthread\n%O\nuser\n%O\nmessage\n%O',
      recipient,
      thread,
      user,
      message
    );
    // $FlowIssue
    return Promise.resolve();
  }

  const { communityId, channelId, ...restOfThread } = thread;

  return bufferNotificationEmail(
    recipient,
    {
      ...restOfThread,
      community: await getCommunityById(communityId),
      channel: await getChannelById(channelId),
      replies: [
        {
          id: message.id,
          sender: {
            id: user.id,
            profilePhoto: user.profilePhoto,
            name: user.name,
            username: user.username,
          },
          content: {
            body:
              message.messageType === 'draftjs'
                ? toPlainText(toState(JSON.parse(message.content.body)))
                : message.content.body,
          },
        },
      ],
    },
    notification
  );
};
