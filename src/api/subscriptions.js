import gql from 'graphql-tag';

import { messageInfoFragment } from './fragments/message/messageInfo';
import { notificationInfoFragment } from './fragments/notification/notificationInfo';
import { threadInfoFragment } from './fragments/thread/threadInfo';
import { directMessageThreadInfoFragment } from './fragments/directMessageThread/directMessageThreadInfo';

export const subscribeToNewMessages = gql`
  subscription subscribeToNewMessages($thread: ID!) {
    messageAdded(thread: $thread) {
      ...messageInfo
    }
  }
  ${messageInfoFragment}
`;

export const subscribeToNewNotifications = gql`
  subscription subscribeToNewNotifications {
    notificationAdded {
      ...notificationInfo
    }
  }
  ${notificationInfoFragment}
`;

export const subscribeToDirectMessageNotifications = gql`
  subscription subscribeToDirectMessageNotifications {
    dmNotificationAdded {
      ...notificationInfo
    }
  }
  ${notificationInfoFragment}
`;

export const subscribeToUpdatedDirectMessageThreads = gql`
  subscription subscribeToUpdatedDirectMessageThreads {
    directMessageThreadUpdated {
      ...directMessageThreadInfo
    }
  }
  ${directMessageThreadInfoFragment}
`;

export const subscribeToUpdatedThreads = gql`
  subscription subscribeToUpdatedThreads {
    threadUpdated {
      ...threadInfo
    }
  }
  ${threadInfoFragment}
`;
