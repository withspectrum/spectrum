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
export const GET_NOTIFICATIONS_QUERY = gql`
  query getNotifications {
    notifications {
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
  ${notificationInfoFragment}
`;

export const GET_NOTIFICATIONS_OPTIONS = {
  name: 'notificationsQuery',
};

export const getNotifications = graphql(
  GET_NOTIFICATIONS_QUERY,
  GET_NOTIFICATIONS_OPTIONS
);

export const MARK_NOTIFICATIONS_READ_MUTATION = gql`
  mutation markAllNotificationsRead {
    markAllNotificationsRead {
      ...notificationInfo
    }
  }
  ${notificationInfoFragment}
`;

export const MARK_NOTIFICATIONS_READ_OPTIONS = {
  props: ({ mutate }) => ({
    markAllNotificationsRead: () => mutate(),
  }),
};

export const markNotificationsReadMutation = graphql(
  MARK_NOTIFICATIONS_READ_MUTATION,
  MARK_NOTIFICATIONS_READ_OPTIONS
);

export const MARK_NOTIFICATIONS_SEEN_MUTATION = gql`
  mutation markAllNotificationsSeen {
    markAllNotificationsSeen {
      ...notificationInfo
    }
  }
  ${notificationInfoFragment}
`;

export const MARK_NOTIFICATIONS_SEEN_OPTIONS = {
  props: ({ mutate }) => ({
    markAllNotificationsSeen: () => mutate(),
  }),
};

export const markNotificationsSeenMutation = graphql(
  MARK_NOTIFICATIONS_SEEN_MUTATION,
  MARK_NOTIFICATIONS_SEEN_OPTIONS
);

export const MARK_DM_NOTIFICATIONS_SEEN_MUTATION = gql`
  mutation markDirectMessageNotificationsSeen {
    markDirectMessageNotificationsSeen {
      ...notificationInfo
    }
  }
  ${notificationInfoFragment}
`;

export const MARK_DM_NOTIFICATIONS_SEEN_OPTIONS = {
  props: ({ mutate }) => ({
    markDirectMessageNotificationsSeen: () => mutate(),
  }),
};

export const markDirectMessageNotificationsSeenMutation = graphql(
  MARK_DM_NOTIFICATIONS_SEEN_MUTATION,
  MARK_DM_NOTIFICATIONS_SEEN_OPTIONS
);
