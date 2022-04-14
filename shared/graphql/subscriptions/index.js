// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import messageInfoFragment from '../fragments/message/messageInfo';
import notificationInfoFragment from '../fragments/notification/notificationInfo';
import threadInfoFragment from '../fragments/thread/threadInfo';
import communityInfoFragment from '../fragments/community/communityInfo';
import directMessageThreadInfoFragment from '../fragments/directMessageThread/directMessageThreadInfo';

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

export const subscribeToUpdatedCommunities = gql`
  subscription subscribeToUpdatedCommunities($communityIds: [ID!]) {
    communityUpdated(communityIds: $communityIds) {
      ...communityInfo
    }
  }
  ${communityInfoFragment}
`;

const SUBSCRIBE_TO_WEB_PUSH_MUTATION = gql`
  mutation subscribeToWebPush($subscription: WebPushSubscription!) {
    subscribeWebPush(subscription: $subscription)
  }
`;

const SUBSCRIBE_TO_WEB_PUSH_OPTIONS = {
  props: ({ mutate }) => ({
    subscribeToWebPush: subscription => {
      if (!subscription) return;
      const json = subscription.toJSON();
      return mutate({
        variables: {
          subscription: {
            endpoint: json.endpoint,
            keys: {
              p256dh: json.keys.p256dh,
              auth: json.keys.auth,
            },
          },
        },
      });
    },
  }),
};

export const subscribeToWebPush = graphql(
  SUBSCRIBE_TO_WEB_PUSH_MUTATION,
  SUBSCRIBE_TO_WEB_PUSH_OPTIONS
);
