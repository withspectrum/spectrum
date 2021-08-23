// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import idx from 'idx';
import notificationInfoFragment from '../../fragments/notification/notificationInfo';
import type { NotificationInfoType } from '../../fragments/notification/notificationInfo';

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
  }),
};

export default graphql(
  getDirectMessageNotificationsQuery,
  getDirectMessageNotificationsOptions
);
