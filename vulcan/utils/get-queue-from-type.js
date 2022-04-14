// @flow
import { communityType } from 'vulcan/queues/types/community';
import { userType } from 'vulcan/queues/types/user';
import { threadType } from 'vulcan/queues/types/thread';
import { messageType } from 'vulcan/queues/types/message';

export const getQueueFromType = (type: string): ?Object => {
  switch (type) {
    case 'user':
      return userType;
    case 'community':
      return communityType;
    case 'thread':
      return threadType;
    case 'message':
      return messageType;
    default:
      return null;
  }
};
