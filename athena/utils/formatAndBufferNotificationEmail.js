// @flow
const debug = require('debug')(
  'athena:queue:format-and-buffer-notification-email'
);
import { toPlainText, toState } from 'shared/draft-utils';
import bufferNotificationEmail from '../queues/buffer-message-notification-email';

type UserType = {
  id: string,
  profilePhoto: string,
  name: string,
};
type MessageType = {
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
type ThreadType = {};

export const formatAndBufferNotificationEmail = (
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

  return bufferNotificationEmail(
    recipient,
    {
      ...thread,
      replies: [
        {
          sender: {
            id: user.id,
            profilePhoto: user.profilePhoto,
            name: user.name,
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

export default formatAndBufferNotificationEmail;
