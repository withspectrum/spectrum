// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

export type MarkDirectMessageNotificationsSeenType = boolean;

export const markDirectMessageNotificationsSeenMutation = gql`
  mutation markDirectMessageNotificationsSeen {
    markDirectMessageNotificationsSeen
  }
`;

const markDirectMessageNotificationsSeenOptions = {
  props: ({ mutate }: { mutate: Function }) => ({
    markDirectMessageNotificationsSeen: () => mutate(),
  }),
};

export default graphql(
  markDirectMessageNotificationsSeenMutation,
  markDirectMessageNotificationsSeenOptions
);
