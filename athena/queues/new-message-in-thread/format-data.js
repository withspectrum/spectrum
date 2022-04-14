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
import { signUser, signCommunity, signThread } from 'shared/imgix';

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
  let body;
  switch (message.messageType) {
    case 'draftjs': {
      body = toPlainText(toState(JSON.parse(message.content.body)));
      break;
    }
    case 'media': {
      body = message.content.body;
      break;
    }
    default: {
      body = message.content.body;
    }
  }

  const signedUser = signUser(user);
  const community = await getCommunityById(thread.communityId);
  const signedCommunity = signCommunity(community);
  const signedThread = signThread(thread);

  return {
    ...signedThread,
    community: signedCommunity,
    channel: await getChannelById(thread.channelId),
    replies: [
      {
        id: message.id,
        sender: {
          id: user.id,
          profilePhoto: signedUser.profilePhoto,
          name: user.name,
          username: user.username,
        },
        content: {
          body,
        },
      },
    ],
  };
};
