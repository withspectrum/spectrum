// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import idx from 'idx';
import notificationInfoFragment from '../../fragments/notification/notificationInfo';
import type { NotificationInfoType } from '../../fragments/notification/notificationInfo';
import { subscribeToDirectMessageNotifications } from '../../subscriptions';

type Edge = {
  cursor: string,
  node: {
    ...$Exact<NotificationInfoType>,
  },
};

export type GetDirectMessageNotificationsType = {
  pageInfo: {
    hasNextPage: boolean,
    hasPreviousPage: boolean,
  },
  edges: Array<?Edge>,
};

export const getDirectMessageNotificationsQuery = gql`
  query getDMNotifications($after: String) {
    directMessageNotifications(after: $after) {
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

export const getDirectMessageNotificationsOptions = {
  options: {
    fetchPolicy: 'network-only',
  },
  props: (props: any) => ({
    ...props,
    refetch: () => props.data.refetch(),
    subscribeToDMs: (callback?: Function) => {
      return props.data.subscribeToMore({
        document: subscribeToDirectMessageNotifications,
        updateQuery: (prev, { subscriptionData }) => {
          const newNotification = idx(
            subscriptionData,
            _ => _.data.dmNotificationAdded
          );
          if (!newNotification) return prev;

          if (callback) callback(newNotification);

          const notificationNode = {
            ...newNotification,
            __typename: 'Notification',
          };

          if (!prev.directMessageNotifications) {
            return {
              __typename: 'NotificationsConnection',
              pageInfo: {
                hasNextPage: false,
                __typename: 'PageInfo',
              },
              directMessageNotifications: {
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
            directMessageNotifications: {
              ...prev.directMessageNotifications,
              edges: [
                {
                  node: notificationNode,
                  cursor: '__this-is-a-cursor__',
                  __typename: 'NotificationEdge',
                },
                ...prev.directMessageNotifications.edges,
              ],
            },
          });
        },
      });
    },
  }),
};

export default graphql(
  getDirectMessageNotificationsQuery,
  getDirectMessageNotificationsOptions
);
