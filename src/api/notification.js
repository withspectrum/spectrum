// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
import { userInfoFragment } from './fragments/user/userInfo';
import {
  notificationInfoFragment,
} from './fragments/notification/notificationInfo';

/*
  Fetches the latest 20 notifications for the current user
*/
export const GET_CURRENT_USER_NOTIFICATIONS_QUERY = gql`
  query getCurrentUserNotifications {
    user: currentUser {
      ...userInfo
      notificationConnection {
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        edges {
          cursor
          node {
            ...notificationInfo
          }
        }
      }
    }
  }
  ${userInfoFragment}
  ${notificationInfoFragment}
`;
export const getCurrentUserNotifications = graphql(
  GET_CURRENT_USER_NOTIFICATIONS_QUERY
);

export const MARK_NOTIFICATIONS_AS_SEEN_MUTATION = gql`
  mutation markAllUserNotificationsSeen {
    markAllUserNotificationsSeen {
      ...notificationInfo
    }
  }
  ${notificationInfoFragment}
`;

export const MARK_NOTIFICATIONS_AS_SEEN_OPTIONS = {
  props: ({ mutate }) => ({
    markAllUserNotificationsSeen: () => mutate(),
  }),
};

export const markNotificationsAsSeenMutation = graphql(
  MARK_NOTIFICATIONS_AS_SEEN_MUTATION,
  MARK_NOTIFICATIONS_AS_SEEN_OPTIONS
);

export const MARK_DM_NOTIFICATIONS_AS_SEEN_MUTATION = gql`
  mutation markDirectMessageNotificationsAsSeen {
    markDirectMessageNotificationsAsSeen {
      ...notificationInfo
    }
  }
  ${notificationInfoFragment}
`;

export const MARK_DM_NOTIFICATIONS_AS_SEEN_OPTIONS = {
  props: ({ mutate }) => ({
    markDirectMessageNotificationsAsSeen: () => mutate(),
  }),
};

export const markDirectMessageNotificationsAsSeenMutation = graphql(
  MARK_DM_NOTIFICATIONS_AS_SEEN_MUTATION,
  MARK_DM_NOTIFICATIONS_AS_SEEN_OPTIONS
);
