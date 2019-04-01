// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { getNotificationsQuery } from '../../queries/notification/getNotifications';

export type MarkNotificationsSeenType = boolean;

export const markNotificationsSeenMutation = gql`
  mutation markAllNotificationsSeen {
    markAllNotificationsSeen
  }
`;

const markNotificationsSeenOptions = {
  props: ({ mutate }: { mutate: Function }) => ({
    markAllNotificationsSeen: () =>
      mutate({
        optimisticResponse: {
          markAllNotificationsSeen: true,
        },
        update: store => {
          const data = store.readQuery({ query: getNotificationsQuery });

          // Mark all notifications as seen optimistically
          data.notifications.edges.forEach((_, index) => {
            data.notifications.edges[index].node.isSeen = true;
          });

          store.writeQuery({
            query: getNotificationsQuery,
            data,
          });
        },
      }),
  }),
};

export default graphql(
  markNotificationsSeenMutation,
  markNotificationsSeenOptions
);
