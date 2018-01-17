// @flow
// $FlowFixMe
import { gql } from 'react-apollo';
import messageInfoFragment from 'shared/graphql/fragments/message/messageInfo';
import notificationInfoFragment from 'shared/graphql/fragments/notification/notificationInfo';
import threadInfoFragment from 'shared/graphql/fragments/thread/threadInfo';
import directMessageThreadInfoFragment from 'shared/graphql/fragments/directMessageThread/directMessageThreadInfo';

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
