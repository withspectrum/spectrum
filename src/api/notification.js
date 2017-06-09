// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
import {
  notificationInfoFragment,
} from './fragments/notification/notificationInfo';

const LoadMoreNotifications = gql`
  query loadMoreNotifications($after: String) {
    notifications(after: $after) {
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

/*
  Fetches the latest 10 notifications for the current user
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
  props: ({ data: { fetchMore, error, loading, notifications } }) => ({
    data: {
      error,
      loading,
      notifications,
      hasNextPage: notifications ? notifications.pageInfo.hasNextPage : false,
      fetchMore: () =>
        fetchMore({
          query: LoadMoreNotifications,
          variables: {
            after: notifications.edges[notifications.edges.length - 1].cursor,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult.notifications) {
              return prev;
            }

            return {
              ...prev,
              notifications: {
                ...prev.notifications,
                pageInfo: {
                  ...prev.notifications.pageInfo,
                  ...fetchMoreResult.notifications.pageInfo,
                },
                edges: [
                  ...prev.notifications.edges,
                  ...fetchMoreResult.notifications.edges,
                ],
              },
            };
          },
        }),
    },
  }),
};

export const GET_NOTIFICATIONS_NAVBAR_OPTIONS = {
  name: 'notificationsQuery',
};

export const getNotifications = graphql(
  GET_NOTIFICATIONS_QUERY,
  GET_NOTIFICATIONS_OPTIONS
);

export const getNotificationsForNavbar = graphql(
  GET_NOTIFICATIONS_QUERY,
  GET_NOTIFICATIONS_NAVBAR_OPTIONS
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
