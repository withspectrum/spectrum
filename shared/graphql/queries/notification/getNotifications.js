// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import notificationInfoFragment from '../../fragments/notification/notificationInfo';
import type { NotificationInfoType } from '../../fragments/notification/notificationInfo';
import { subscribeToNewNotifications } from '../../subscriptions';

type Edge = {
  cursor: string,
  node: {
    ...$Exact<NotificationInfoType>,
  },
};

export type GetNotificationsType = {
  pageInfo: {
    hasNextPage: boolean,
    hasPreviousPage: boolean,
  },
  edges: Array<?Edge>,
};

const LoadMoreNotifications = gql`
  query loadMoreNotifications($after: String, $first: PaginationAmount) {
    notifications(after: $after, first: $first) {
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
export const getNotificationsQuery = gql`
  query getNotifications($after: String, $first: PaginationAmount) {
    notifications(after: $after, first: $first)
      @connection(key: "notifications") {
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

export const getNotificationsOptions = {
  options: {
    variables: {
      after: null,
      first: 10,
    },
  },
  props: ({
    data: {
      fetchMore,
      error,
      loading,
      notifications,
      subscribeToMore,
      refetch,
      networkStatus,
    },
  }: any) => ({
    data: {
      networkStatus,
      error,
      loading,
      notifications,
      hasNextPage: notifications ? notifications.pageInfo.hasNextPage : false,
      fetchMore: () =>
        fetchMore({
          query: LoadMoreNotifications,
          variables: {
            after: notifications.edges[notifications.edges.length - 1].cursor,
            first: 10,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult.notifications) {
              return prev;
            }

            return Object.assign({}, prev, {
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
            });
          },
        }),
      refetch: () => refetch(),
      subscribeToNewNotifications: () =>
        subscribeToMore({
          document: subscribeToNewNotifications,
          updateQuery: (prev, { subscriptionData }) => {
            let newNotification = subscriptionData.data.notificationAdded;
            if (!newNotification) return prev;

            const notificationNode = {
              ...newNotification,
              __typename: 'Notification',
            };

            if (!prev.notifications) {
              return {
                __typename: 'NotificationsConnection',
                pageInfo: {
                  hasNextPage: true,
                  __typename: 'PageInfo',
                },
                notifications: {
                  edges: [
                    {
                      node: notificationNode,
                      cursor: '__this-is-a-cursor__',
                      __typename: 'NotificationEdge',
                    },
                  ],
                },
                ...prev,
              };
            }

            // Add the new notification to the data
            return Object.assign({}, prev, {
              ...prev,
              notifications: {
                ...prev.notifications,
                edges: [
                  {
                    node: notificationNode,
                    cursor: '__this-is-a-cursor__',
                    __typename: 'NotificationEdge',
                  },
                  ...prev.notifications.edges,
                ],
              },
            });
          },
        }),
    },
  }),
};

export default graphql(getNotificationsQuery, getNotificationsOptions);
