// @flow
const debug = require('debug')(
  'athena:queue:format-and-buffer-notification-email'
);
import { getCommunityById } from '../../models/community';
import { getChannelById } from '../../models/channel';
import { toPlainText, toState } from 'shared/draft-utils';
import bufferNotificationEmail from './buffer-email';
import type { DBUser, DBMessage, DBThread, DBNotification } from 'shared/types';
import type { NewMessageNotificationEmailThread } from './buffer-email';

type UserType = DBUser;
type MessageType = DBMessage;
type RecipientType = {
  email: string,
  username: string,
  userId: string,
  name: string,
};
type NotificationType = DBNotification;
type ThreadType = DBThread;

export default async (
  thread: ThreadType,
  user: UserType,
  message: MessageType
): Promise<NewMessageNotificationEmailThread> => {
  return {
    ...thread,
    community: await getCommunityById(thread.communityId),
    channel: await getChannelById(thread.channelId),
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
  };
};
